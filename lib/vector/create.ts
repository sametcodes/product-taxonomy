import { PineconeClient } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai";
import { env } from "./env.mjs";
import { getCategoryTaxonomy } from "./shopify/index.js";
import { createEmbedding } from "./openai/index.js";
import fs from "fs";
import throat from "throat";

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
    organization: env.OPENAI_ORGANIZATION,
});
const openai = new OpenAIApi(configuration);

type Vector = {
    id: string
    metadata: {
        [key: string]: string;
    },
    values: Array<number>;
}


(async () => {
    const pinecone = new PineconeClient();
    await pinecone.init({ environment: env.PINECONE_ENVIRONMENT, apiKey: env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index("shopifytaxonomy");

    const lang = "tr";
    const categories = await getCategoryTaxonomy({ lang });
    categories
        .filter(category => category.categoryName?.includes(">") === false)
        .map(throat(5, async (category, index) => {
            const response: any = await createEmbedding({
                input: category.categoryName
            });

            const upsertRequest = {
                vectors: [{
                    id: String(index + 6000),
                    metadata: {
                        id: String(category.categoryId),
                        categoryName: category.categoryName
                    },
                    values: response.data[0].embedding
                }],
                namespace: `shopify-main-taxonomy-${lang}`,
            };

            const upsertResponse = await pineconeIndex.upsertRaw({ upsertRequest });
            if (upsertResponse.raw.status !== 200) {
                console.log(upsertResponse.raw.statusText)
                return null;
            }
            console.log(`(${index + 1}/${categories.length}) ― created vector for [${category.categoryName}]`)
            return null;
        }))
})();