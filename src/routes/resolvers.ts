import { Request, Response } from "express";
import { searchInVectors, createCategoryVector, deleteNamespace } from '../lib/pinecone'
import { createEmbedding } from "../lib/openai";
import { parseCSV } from "../utils";
import throat from 'throat';
import { v4 as uuidv4 } from 'uuid';

const availablePlatforms = [
    "shopify",
    "amazon",
    "ciceksepeti_test",
    "hepsiburada",
    "trendyol"
]

export const queryCategory = async (req: Request, res: Response) => {
    if (availablePlatforms.includes(req.params.platform) === false) {
        return res.status(400).json({
            success: false, data: null,
            error: 'The given platform is not available. Available platforms' + availablePlatforms.join(', ')
        })
    }
    if (!req.query.input) {
        return res.status(400).json({ success: false, data: null, error: 'Input param is required' })
    }
    const { input, deepSearch } = req.query;
    const { platform } = req.params;

    const embedding = await createEmbedding({ input: String(input) })
    const vector: number[] = embedding.data[0].embedding;

    let response = await searchInVectors(platform, vector);

    if (deepSearch === "true") {
        const uid = uuidv4();
        if (!response?.matches) return res.json({ success: false, data: null, error: "No matches found" })

        const initial_matches: any[] = response.matches;
        const temp_namespace = `temp_${uid}`
        await Promise.all((initial_matches).map((category, index) => {
            const deepestCategory = category.metadata.categoryName.split('>').slice(-1)[0].trim();
            return createCategoryVector(temp_namespace, String(category.metadata.id), deepestCategory)
        }))

        response = await searchInVectors(temp_namespace, vector);
        response.matches = response.matches?.map((match: any) => {
            const initial_match = initial_matches.find((m) => m.metadata.id === match.metadata.id)
            return {
                ...match,
                metadata: {
                    ...match.metadata,
                    categoryName: initial_match.metadata.categoryName
                }
            }
        })
        deleteNamespace(temp_namespace)
    }

    return res.json({
        success: true,
        data: response.matches,
        error: null
    })
}

export const createVectors = async (req: Request, res: Response) => {
    if (availablePlatforms.includes(req.params.platform) === false) {
        return res.status(400).json({
            success: false, data: null,
            error: 'The given platform is not available. Available platforms' + availablePlatforms.join(', ')
        })
    }
    if (!req.file) return res.status(400).json({ error: `You didn't provide a file` });

    const platform = req.params.platform;
    const fileContent = req.file.buffer.toString('utf-8');

    const categories = parseCSV(fileContent);
    categories.forEach(throat(50, async (category, index) => {
        const response = await createCategoryVector(platform, category.id, category.name)
        if (!response || response.raw.status !== 200) {
            console.log(`ER: [${index + 1}/${categories.length}] ${category.name} couldn't be created`)
        } else {
            console.log(`OK: [${index + 1}/${categories.length}] ${category.name} is created`)
        }
    }))

    return res.json({ success: true, data: "OK", error: null })
}