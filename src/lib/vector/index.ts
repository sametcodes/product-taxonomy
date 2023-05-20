
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { HNSWLib } from "langchain/vectorstores/hnswlib"
import { env } from "../../env"
import fs from 'fs';

const embeddingModel = new OpenAIEmbeddings({
    maxConcurrency: 5,
    openAIApiKey: env.OPENAI_API_KEY,
})

type Metadata = {
    id: string;
    categoryName: string;
    platform: string;
}

export const createCategoryVector = async (platform: string, texts: Array<string>, metadatas: Array<Metadata>) => {
    const vectorStore = await HNSWLib.fromTexts(texts, metadatas, embeddingModel, { docstore: undefined })
    await vectorStore.save(`vectors/${platform}`)
    return true;
}

export const searchInVectors = async (platform: string, input: string) => {
    const vectorStore = await HNSWLib.load(`vectors/${platform}`, embeddingModel)
    return vectorStore.similaritySearch(input, 20)
}

export const deleteVectors = async (platform: string) => {
    fs.rmSync(`vectors/${platform}`, { recursive: true })
}