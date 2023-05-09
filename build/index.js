"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var env_1 = require("./env");
var routes_1 = __importDefault(require("./routes"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
routes_1.default.forEach(function (route) {
    app[route.method].apply(app, __spreadArray(__spreadArray([route.path], route.middlewares, false), [route.handler], false));
});
app.listen(env_1.env.PORT, function () {
    console.log("Server running on port ".concat(env_1.env.PORT));
});
