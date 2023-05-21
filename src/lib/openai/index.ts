import { env } from "../../env";
import fetch from "node-fetch";

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