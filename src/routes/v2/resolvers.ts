import { Request, Response } from "express";
import { createCategoryVector, searchInVectors } from "../../lib/vector";
import { parseCSV } from "../../utils";

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
    const { input } = req.body;
    const response = await searchInVectors(platform, input);

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