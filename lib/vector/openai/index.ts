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

type Model = "text-davinci-003" | "text-davinci-002" | "text-curie-001" | "text-babbage-001" | "text-ada-001" | "curie:ft-neptune-2023-05-07-10-35-39";

export const produceKeywords = ({ input, lang, model }: { input: string, model: Model, lang: string }) => {
    var raw = JSON.stringify({
        prompt: `${input}
        Extract 3-level categories from this product name FOR SHOPIFY CATEGORY TAXONOMY. Return only your output. Split levels with > character. Output language: ${lang.toUpperCase()}`,
        temperature: 0.2,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.8,
        presence_penalty: 0,
    });
    return fetch(`https://api.openai.com/v1/engines/${model}/completions`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: raw
    }).then(response => response.json())
        .catch(error => console.log('error', error));
}