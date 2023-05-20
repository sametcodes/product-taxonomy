"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var resolvers = __importStar(require("./resolvers"));
var resolversV2 = __importStar(require("./v2/resolvers"));
var multer_1 = __importDefault(require("multer"));
var body_parser_1 = __importDefault(require("body-parser"));
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
var routes = [{
        path: '/category/predict/:platform',
        method: 'post',
        middlewares: [body_parser_1.default.urlencoded(), body_parser_1.default.json()],
        handler: resolvers.queryCategory
    }, {
        path: '/category/:platform',
        method: 'post',
        middlewares: [upload.single("file")],
        handler: resolvers.createVectors
    }, {
        path: '/category/:platform',
        method: 'delete',
        middlewares: [],
        handler: resolvers.deleteVectors
    }, {
        path: '/v2/category/predict/:platform',
        method: 'post',
        middlewares: [body_parser_1.default.urlencoded(), body_parser_1.default.json()],
        handler: resolversV2.queryCategory
    }, {
        path: '/v2/category/:platform',
        method: 'post',
        middlewares: [upload.single("file")],
        handler: resolversV2.createVectors
    }];
exports.default = routes;
