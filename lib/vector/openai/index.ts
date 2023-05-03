import { env } from "../env.mjs";

export const createEmbedding = ({ input }: { input: string | Array<string> }) => {
    var raw = JSON.stringify({
        "model": "text-embedding-ada-002",
        "input": input
    });

    return fetch("https://api.openai.com/v1/embeddings", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
    }).then(response => response.json())
        .catch(error => console.log('error', error));
}

export const produceKeywords = ({ input }: { input: string }) => {
    var raw = JSON.stringify({
        prompt: `Extract main category with sub categories with 3 level from these product description FOR SHOPIFY CATEGORY TAXONOMY.
        Do not add product name. Split with > character.
        ${input}`,
        temperature: 0.2,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.8,
        presence_penalty: 0,
    });
    return fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: raw
    }).then(response => response.json())
        .catch(error => console.log('error', error));
}