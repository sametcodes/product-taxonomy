import { Request, Response } from "express";
import { createCategoryVector, deleteVectors, searchInVectors } from "../../lib/vector";
import { parseCSV } from "../../utils";
import { v4 as uuidv4 } from 'uuid';

const availablePlatforms = [
    "shopify",
    "amazon",
    "ciceksepeti",
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
    if (!req.body.input) {
        return res.status(400).json({ success: false, data: null, error: 'Input data is required' })
    }
    const { platform } = req.params;
    const { input, deepSearch } = req.body;
    const response = await searchInVectors(platform, input);

    if (deepSearch === "true") {
        const uuid = uuidv4();
        const texts = response.map(category => category.metadata.categoryName.split('>').slice(-1)[0].trim());
        const metadatas = response.map(category => ({ id: category.metadata.id, categoryName: category.metadata.categoryName, platform }));

        await createCategoryVector(uuid, texts, metadatas)
        const similarities = await searchInVectors(uuid, input);
        await deleteVectors(uuid);
        return res.json({ success: true, data: similarities, error: null })
    }

    return res.json({
        success: true,
        data: response,
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

    const categories = parseCSV(fileContent)
    const texts = categories.map(category => category.name)
    const metadatas = categories.map(category => ({ id: category.id, categoryName: category.name, platform }))
    await createCategoryVector(platform, texts, metadatas)
    return res.json({ success: true, data: "OK", error: null })
}