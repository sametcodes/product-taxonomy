import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

export const env = createEnv({
    server: {
        OPENAI_API_KEY: z.string().nonempty(),
        PINECONE_API_KEY: z.string().nonempty(),
        PINECONE_ENVIRONMENT: z.string().nonempty(),
        PINECONE_INDEX_NAME: z.string().nonempty(),
        OPENAI_ORGANIZATION: z.string().nonempty()
    },
    runtimeEnv: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_ORGANIZATION: process.env.OPENAI_ORGANIZATION,
        PINECONE_API_KEY: process.env.PINECONE_API_KEY,
        PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
        PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
    }
});

