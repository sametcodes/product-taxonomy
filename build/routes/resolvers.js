"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVectors = exports.createVectors = exports.queryCategory = void 0;
var pinecone_1 = require("../lib/pinecone");
var openai_1 = require("../lib/openai");
var utils_1 = require("../utils");
var throat_1 = __importDefault(require("throat"));
var uuid_1 = require("uuid");
var availablePlatforms = [
    "shopify",
    "amazon",
    "ciceksepeti",
    "hepsiburada",
    "trendyol"
];
var queryCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var platform, _a, input, deepSearch, lang, embedding, vector, namespace, response, uid, initial_matches_1, temp_namespace_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (availablePlatforms.includes(req.params.platform) === false) {
                    return [2 /*return*/, res.status(400).json({
                            success: false, data: null,
                            error: 'The given platform is not available. Available platforms' + availablePlatforms.join(', ')
                        })];
                }
                if (!req.body.input) {
                    return [2 /*return*/, res.status(400).json({ success: false, data: null, error: 'Input data is required' })];
                }
                platform = req.params.platform;
                _a = req.body, input = _a.input, deepSearch = _a.deepSearch, lang = _a.lang;
                return [4 /*yield*/, (0, openai_1.createEmbedding)({ input: String(input) })];
            case 1:
                embedding = _c.sent();
                vector = embedding.data[0].embedding;
                namespace = "".concat(platform).concat(lang ? "_".concat(lang) : '');
                return [4 /*yield*/, (0, pinecone_1.searchInVectors)(namespace, vector)];
            case 2:
                response = _c.sent();
                if (!(deepSearch === "true")) return [3 /*break*/, 5];
                uid = (0, uuid_1.v4)();
                if (!(response === null || response === void 0 ? void 0 : response.matches))
                    return [2 /*return*/, res.json({ success: false, data: null, error: "No matches found" })];
                initial_matches_1 = response.matches;
                temp_namespace_1 = "temp_".concat(uid);
                return [4 /*yield*/, Promise.all((initial_matches_1).map(function (category, index) {
                        var deepestCategory = category.metadata.categoryName.split('>').slice(-1)[0].trim();
                        return (0, pinecone_1.createCategoryVector)(temp_namespace_1, String(category.metadata.id), deepestCategory);
                    }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, pinecone_1.searchInVectors)(temp_namespace_1, vector)];
            case 4:
                response = _c.sent();
                response.matches = (_b = response.matches) === null || _b === void 0 ? void 0 : _b.map(function (match) {
                    var initial_match = initial_matches_1.find(function (m) { return m.metadata.id === match.metadata.id; });
                    return __assign(__assign({}, match), { metadata: __assign(__assign({}, match.metadata), { categoryName: initial_match.metadata.categoryName }) });
                });
                (0, pinecone_1.deleteNamespace)(temp_namespace_1);
                _c.label = 5;
            case 5: return [2 /*return*/, res.json({
                    success: true,
                    data: response.matches,
                    error: null
                })];
        }
    });
}); };
exports.queryCategory = queryCategory;
var createVectors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var platform, lang, fileContent, categories;
    return __generator(this, function (_a) {
        if (availablePlatforms.includes(req.params.platform) === false) {
            return [2 /*return*/, res.status(400).json({
                    success: false, data: null,
                    error: 'The given platform is not available. Available platforms' + availablePlatforms.join(', ')
                })];
        }
        if (!req.file)
            return [2 /*return*/, res.status(400).json({ error: "You didn't provide a file" })];
        platform = req.params.platform;
        lang = req.body.lang;
        fileContent = req.file.buffer.toString('utf-8');
        categories = (0, utils_1.parseCSV)(fileContent);
        categories.forEach((0, throat_1.default)(50, function (category, index) { return __awaiter(void 0, void 0, void 0, function () {
            var namespace, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        namespace = "".concat(platform).concat(lang ? "_".concat(lang) : '');
                        return [4 /*yield*/, (0, pinecone_1.createCategoryVector)(namespace, category.id, category.name)];
                    case 1:
                        response = _a.sent();
                        if (!response || response.raw.status !== 200) {
                            console.log("ER: [".concat(index + 1, "/").concat(categories.length, "] ").concat(category.name, " couldn't be created"));
                        }
                        else {
                            console.log("OK: [".concat(index + 1, "/").concat(categories.length, "] ").concat(category.name, " is created"));
                        }
                        return [2 /*return*/];
                }
            });
        }); }));
        return [2 /*return*/, res.json({ success: true, data: "OK", error: null })];
    });
}); };
exports.createVectors = createVectors;
var deleteVectors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, pinecone_1.deleteNamespace)(req.params.platform)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, res.json(response)];
        }
    });
}); };
exports.deleteVectors = deleteVectors;
