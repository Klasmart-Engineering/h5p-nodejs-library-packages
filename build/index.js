"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.contentTypeCacheExpressRouter = exports.libraryAdministrationExpressRouter = exports.h5pAjaxExpressRouter = void 0;
var H5PAjaxExpressRouter_1 = __importDefault(require("./H5PAjaxRouter/H5PAjaxExpressRouter"));
exports.h5pAjaxExpressRouter = H5PAjaxExpressRouter_1["default"];
var LibraryAdministrationExpressRouter_1 = __importDefault(require("./LibraryAdministrationRouter/LibraryAdministrationExpressRouter"));
exports.libraryAdministrationExpressRouter = LibraryAdministrationExpressRouter_1["default"];
var ContentTypeCacheExpressRouter_1 = __importDefault(require("./ContentTypeCacheRouter/ContentTypeCacheExpressRouter"));
exports.contentTypeCacheExpressRouter = ContentTypeCacheExpressRouter_1["default"];
//# sourceMappingURL=index.js.map