"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNamespace = exports.createCategoryVector = exports.searchInVectors = void 0;
var env_1 = require("../../env");
var pinecone_1 = require("@pinecone-database/pinecone");
var openai_1 = require("../openai");
var pinecone = new pinecone_1.PineconeClient();
var client = pinecone.init({
    environment: env_1.env.PINECONE_ENVIRONMENT,
    apiKey: env_1.env.PINECONE_API_KEY
});
var index = "taxonomy";
var searchInVectors = function (namespace, vector) { return __awaiter(void 0, void 0, void 0, function () {
    var pineconeIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client];
            case 1:
                _a.sent();
                pineconeIndex = pinecone.Index(index);
                return [2 /*return*/, pineconeIndex.query({
                        queryRequest: {
                            namespace: namespace,
                            topK: 10,
                            vector: vector,
                            includeMetadata: true
                        }
                    })];
        }
    });
}); };
exports.searchInVectors = searchInVectors;
var createCategoryVector = function (namespace, id, name) { return __awaiter(void 0, void 0, void 0, function () {
    var response, upsertRequest, pineconeIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, openai_1.createEmbedding)({ input: name })];
            case 2:
                response = _a.sent();
                if (!(response === null || response === void 0 ? void 0 : response.data)) {
                    return [2 /*return*/, null];
                }
                upsertRequest = {
                    namespace: namespace,
                    vectors: [{
                            id: String(namespace + "_" + id),
                            metadata: {
                                id: String(id),
                                categoryName: name
                            },
                            values: response.data[0].embedding
                        }],
                };
                pineconeIndex = pinecone.Index(index);
                return [2 /*return*/, pineconeIndex.upsertRaw({ upsertRequest: upsertRequest })];
        }
    });
}); };
exports.createCategoryVector = createCategoryVector;
var deleteNamespace = function (namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var pineconeIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client];
            case 1:
                _a.sent();
                pineconeIndex = pinecone.Index(index);
                return [2 /*return*/, pineconeIndex.delete1({
                        namespace: namespace,
                        deleteAll: true,
                    })];
        }
    });
}); };
exports.deleteNamespace = deleteNamespace;
