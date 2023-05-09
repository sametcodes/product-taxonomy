"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceKeywords = exports.createEmbedding = void 0;
var env_1 = require("../../env");
var node_fetch_1 = __importDefault(require("node-fetch"));
var createEmbedding = function (_a) {
    var input = _a.input;
    var raw = JSON.stringify({
        "model": "text-embedding-ada-002",
        "input": input
    });
    return (0, node_fetch_1.default)("https://api.openai.com/v1/embeddings", {
        method: 'POST',
        headers: {
            "Authorization": "Bearer ".concat(env_1.env.OPENAI_API_KEY),
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
    }).then(function (response) { return response.json(); })
        .catch(function (error) { return console.log('error', error); });
};
exports.createEmbedding = createEmbedding;
var produceKeywords = function (_a) {
    var input = _a.input, lang = _a.lang, model = _a.model;
    var raw = JSON.stringify({
        prompt: "".concat(input, "\n        Extract 3-level categories from this product name FOR SHOPIFY CATEGORY TAXONOMY. Return only your output. Split levels with > character. Output language: ").concat(lang.toUpperCase()),
        temperature: 0.2,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.8,
        presence_penalty: 0,
    });
    return (0, node_fetch_1.default)("https://api.openai.com/v1/engines/".concat(model, "/completions"), {
        method: 'POST',
        headers: {
            "Authorization": "Bearer ".concat(env_1.env.OPENAI_API_KEY),
            "Content-Type": "application/json"
        },
        body: raw
    }).then(function (response) { return response.json(); })
        .catch(function (error) { return console.log('error', error); });
};
exports.produceKeywords = produceKeywords;
