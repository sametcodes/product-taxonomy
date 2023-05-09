"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var resolvers_1 = require("./resolvers");
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
var routes = [{
        path: '/category/:platform',
        method: 'get',
        middlewares: [],
        handler: resolvers_1.queryCategory
    }, {
        path: '/category/:platform',
        method: 'post',
        middlewares: [upload.single("file")],
        handler: resolvers_1.createVectors
    }];
exports.default = routes;
