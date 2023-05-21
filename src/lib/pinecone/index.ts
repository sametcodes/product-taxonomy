import { env } from "../../env";
import { PineconeClient } from "@pinecone-database/pinecone";
import { createEmbedding } from "../openai";

const pinecone = new PineconeClient();
const client = pinecone.init({
    environment: env.PINECONE_ENVIRONMENT,
    apiKey: env.PINECONE_API_KEY
});


export const searchInVectors = async (namespace: string, vector: number[]) => {
    await client;

    const pineconeIndex = pinecone.Index(env.PINECONE_INDEX_NAME);
    return pineconeIndex.query({
        queryRequest: {
            namespace,
            topK: 10,
            vector,
            includeMetadata: true
        }
    });
}

export const createCategoryVector = async (namespace: string, id: string, name: string) => {
    await client;

    const response: any = await createEmbedding({ input: name });
    if(!response?.data){
        return null;
    }

    const upsertRequest = {
        namespace,
        vectors: [{
            id: String(namespace + "_" + id),
            metadata: {
                id: String(id),
                categoryName: name
            },
            values: response.data[0].embedding
        }],
    };

    const pineconeIndex = pinecone.Index(env.PINECONE_INDEX_NAME);
    return pineconeIndex.upsertRaw({ upsertRequest });
}

export const deleteNamespace = async (namespace: string) => {
    await client;

    const pineconeIndex = pinecone.Index(env.PINECONE_INDEX_NAME);
    return pineconeIndex.delete1({
        namespace,
        deleteAll: true,
    })
}