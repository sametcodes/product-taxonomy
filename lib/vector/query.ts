import { PineconeClient } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai";
import { env } from "./env.mjs";
import { createEmbedding, produceKeywords } from "./openai/index.js";
import fs from 'fs';
import { readFile } from "./file/index.js";
import { metadata } from '../../src/app/layout';

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
    organization: env.OPENAI_ORGANIZATION,
});
const openai = new OpenAIApi(configuration);

type Vector = {
    id: string | number;
    metadata: {
        [key: string]: string;
    },
    values: Array<number>;
}

const products = readFile();

const pricing = {
    "text-davinci-003": 0.02,
    "text-davinci-002": 0.02,
    "text-curie-001": 0.002,
    "text-babbage-001": 0.0005,
    "text-ada-001": 0.0004
};

(async () => {
    const pinecone = new PineconeClient();
    await pinecone.init({
        environment: env.PINECONE_ENVIRONMENT,
        apiKey: env.PINECONE_API_KEY
    });

    const lang = "tr";
    const index = pinecone.Index("shopifytaxonomy");

    fs.writeFileSync(
        `./file/categories.csv`,
        ["Handle", "Predict 1", "Predict 2", "Predict 3", "Predict 4", "Predict 5", "Has Description"].join(",") + "\n"
    );

    const model = "text-davinci-003";
    let totalUsedTokens = 0;

    for (var product of products.slice(0, 10)) {
        const input = `${product.Title}  ${product["Body(HTML)"]?.replace(/(<([^>]+)>)/ig, "")}`
        const response_keywords = await produceKeywords({ input, model, lang });
        if (!response_keywords || !response_keywords.choices || !response_keywords.choices[0]) {
            console.log(`${product.Title} ― no keywords`)
            continue;
        }
        totalUsedTokens += response_keywords.usage.total_tokens;
        const categoryName = response_keywords.choices[0].text;
        console.log(`\nProduced category: ― ${categoryName.replace(/\n/g, "")}`)

        const embedding = await createEmbedding({ input: categoryName })
        const response = await index.query({
            queryRequest: {
                namespace: `shopify-taxonomy-${lang}`,
                topK: 5,
                vector: embedding.data[0].embedding,
                includeMetadata: true
            }
        });

        const matches = response.matches as any;
        const match = matches?.[0]?.metadata as any;
        const score = matches?.[0]?.score as any;
        if (!match) {
            console.log(`${product.Title} ― no match`)
            continue;
        };
        console.log(`${product.Title} ― [${match.id}] ${match.categoryName} ― ${score}`)
        fs.appendFileSync(
            `./file/categories.csv`,
            [product.Handle, ...matches?.map((match: any) => match.metadata.categoryName), Boolean(product["Body(HTML)"])].join(",") + "\n"
        )
        console.log("Cost: ", response_keywords.usage.total_tokens/1000 * pricing[model])
    }
    console.log(`Total cost: ${totalUsedTokens/1000 * pricing[model]}. Total used tokens: ${totalUsedTokens}`)

})();