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
exports.createVectors = exports.queryCategory = void 0;
var vector_1 = require("../../lib/vector");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var availablePlatforms = [
    "shopify",
    "amazon",
    "ciceksepeti",
    "hepsiburada",
    "trendyol"
];
var queryCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var platform, _a, input, deepSearch, response, uuid, texts, metadatas, similarities;
    return __generator(this, function (_b) {
        switch (_b.label) {
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
                _a = req.body, input = _a.input, deepSearch = _a.deepSearch;
                return [4 /*yield*/, (0, vector_1.searchInVectors)(platform, input)];
            case 1:
                response = _b.sent();
                if (!(deepSearch === "true")) return [3 /*break*/, 5];
                uuid = (0, uuid_1.v4)();
                texts = response.map(function (category) { return category.metadata.categoryName.split('>').slice(-1)[0].trim(); });
                metadatas = response.map(function (category) { return ({ id: category.metadata.id, categoryName: category.metadata.categoryName, platform: platform }); });
                return [4 /*yield*/, (0, vector_1.createCategoryVector)(uuid, texts, metadatas)];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, vector_1.searchInVectors)(uuid, input)];
            case 3:
                similarities = _b.sent();
                return [4 /*yield*/, (0, vector_1.deleteVectors)(uuid)];
            case 4:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, data: similarities, error: null })];
            case 5: return [2 /*return*/, res.json({
                    success: true,
                    data: response,
                    error: null
                })];
        }
    });
}); };
exports.queryCategory = queryCategory;
var createVectors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var platform, fileContent, categories, texts, metadatas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (availablePlatforms.includes(req.params.platform) === false) {
                    return [2 /*return*/, res.status(400).json({
                            success: false, data: null,
                            error: 'The given platform is not available. Available platforms' + availablePlatforms.join(', ')
                        })];
                }
                if (!req.file)
                    return [2 /*return*/, res.status(400).json({ error: "You didn't provide a file" })];
                platform = req.params.platform;
                fileContent = req.file.buffer.toString('utf-8');
                categories = (0, utils_1.parseCSV)(fileContent);
                texts = categories.map(function (category) { return category.name; });
                metadatas = categories.map(function (category) { return ({ id: category.id, categoryName: category.name, platform: platform }); });
                return [4 /*yield*/, (0, vector_1.createCategoryVector)(platform, texts, metadatas)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ success: true, data: "OK", error: null })];
        }
    });
}); };
exports.createVectors = createVectors;
