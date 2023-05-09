"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var env_nextjs_1 = require("@t3-oss/env-nextjs");
var zod_1 = require("zod");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = (0, env_nextjs_1.createEnv)({
    server: {
        OPENAI_API_KEY: zod_1.z.string().nonempty(),
        PINECONE_API_KEY: zod_1.z.string().nonempty(),
        PINECONE_ENVIRONMENT: zod_1.z.string().nonempty(),
        PINECONE_INDEX_NAME: zod_1.z.string().nonempty(),
        OPENAI_ORGANIZATION: zod_1.z.string().nonempty(),
        PORT: zod_1.z.string().nonempty().default("6006"),
    },
    client: {},
    runtimeEnv: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_ORGANIZATION: process.env.OPENAI_ORGANIZATION,
        PINECONE_API_KEY: process.env.PINECONE_API_KEY,
        PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
        PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
        PORT: process.env.PORT,
    }
});
