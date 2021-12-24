"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var H5PEditor_1 = __importDefault(require("../../H5PEditor"));
var InMemoryStorage_1 = __importDefault(require("../InMemoryStorage"));
var DirectoryTemporaryFileStorage_1 = __importDefault(require("./DirectoryTemporaryFileStorage"));
var FileContentStorage_1 = __importDefault(require("./FileContentStorage"));
var FileLibraryStorage_1 = __importDefault(require("./FileLibraryStorage"));
function h5pfs(config, librariesPath, temporaryStoragePath, contentPath, contentStorage, translationCallback, urlGenerator, options) {
    return new H5PEditor_1["default"](new InMemoryStorage_1["default"](), config, new FileLibraryStorage_1["default"](librariesPath), contentStorage || new FileContentStorage_1["default"](contentPath), new DirectoryTemporaryFileStorage_1["default"](temporaryStoragePath), translationCallback, urlGenerator, options);
}
exports["default"] = h5pfs;
//# sourceMappingURL=index.js.map