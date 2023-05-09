"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = void 0;
var parseCSV = function (csv) {
    var _a = csv.split("\n"), headers = _a[0], lines = _a.slice(1);
    return lines.map(function (line) {
        var _a = line.split("\t"), id = _a[0], name = _a[1];
        return { id: id, name: name.trim() };
    });
};
exports.parseCSV = parseCSV;
