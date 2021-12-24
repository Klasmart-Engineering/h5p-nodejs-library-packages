"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.__esModule = true;
exports.SimpleLockProvider = exports.UrlGenerator = exports.cacheImplementations = exports.fsImplementations = exports.utils = exports.fs = exports.H5PConfig = exports.Permission = exports.PackageExporter = exports.Logger = exports.LibraryName = exports.LibraryManager = exports.LibraryAdministration = exports.InstalledLibrary = exports.H5PPlayer = exports.H5pError = exports.H5PEditor = exports.H5PAjaxEndpoint = exports.ContentTypeCache = exports.ContentFileScanner = exports.streamToString = exports.AjaxErrorResponse = exports.AggregateH5pError = void 0;
// Classes
var H5PEditor_1 = __importDefault(require("./H5PEditor"));
exports.H5PEditor = H5PEditor_1["default"];
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
exports.H5pError = H5pError_1["default"];
var H5PPlayer_1 = __importDefault(require("./H5PPlayer"));
exports.H5PPlayer = H5PPlayer_1["default"];
var InstalledLibrary_1 = __importDefault(require("./InstalledLibrary"));
exports.InstalledLibrary = InstalledLibrary_1["default"];
var LibraryName_1 = __importDefault(require("./LibraryName"));
exports.LibraryName = LibraryName_1["default"];
var PackageExporter_1 = __importDefault(require("./PackageExporter"));
exports.PackageExporter = PackageExporter_1["default"];
var H5PAjaxEndpoint_1 = __importDefault(require("./H5PAjaxEndpoint"));
exports.H5PAjaxEndpoint = H5PAjaxEndpoint_1["default"];
var ContentTypeCache_1 = __importDefault(require("./ContentTypeCache"));
exports.ContentTypeCache = ContentTypeCache_1["default"];
var AggregateH5pError_1 = __importDefault(require("./helpers/AggregateH5pError"));
exports.AggregateH5pError = AggregateH5pError_1["default"];
var AjaxErrorResponse_1 = __importDefault(require("./helpers/AjaxErrorResponse"));
exports.AjaxErrorResponse = AjaxErrorResponse_1["default"];
var StreamHelpers_1 = require("./helpers/StreamHelpers");
exports.streamToString = StreamHelpers_1.streamToString;
var Logger_1 = __importDefault(require("./helpers/Logger"));
exports.Logger = Logger_1["default"];
var H5PConfig_1 = __importDefault(require("./implementation/H5PConfig"));
exports.H5PConfig = H5PConfig_1["default"];
var fs_1 = __importDefault(require("./implementation/fs"));
exports.fs = fs_1["default"];
var utils = __importStar(require("./implementation/utils"));
exports.utils = utils;
var DirectoryTemporaryFileStorage_1 = __importDefault(require("./implementation/fs/DirectoryTemporaryFileStorage"));
var FileContentStorage_1 = __importDefault(require("./implementation/fs/FileContentStorage"));
var FileLibraryStorage_1 = __importDefault(require("./implementation/fs/FileLibraryStorage"));
var JsonStorage_1 = __importDefault(require("./implementation/fs/JsonStorage"));
var InMemoryStorage_1 = __importDefault(require("./implementation/InMemoryStorage"));
var CachedLibraryStorage_1 = __importDefault(require("./implementation/cache/CachedLibraryStorage"));
var CachedKeyValueStorage_1 = __importDefault(require("./implementation/cache/CachedKeyValueStorage"));
var ContentFileScanner_1 = require("./ContentFileScanner");
exports.ContentFileScanner = ContentFileScanner_1.ContentFileScanner;
var LibraryManager_1 = __importDefault(require("./LibraryManager"));
exports.LibraryManager = LibraryManager_1["default"];
var UrlGenerator_1 = __importDefault(require("./UrlGenerator"));
exports.UrlGenerator = UrlGenerator_1["default"];
var SimpleLockProvider_1 = __importDefault(require("./implementation/SimpleLockProvider"));
exports.SimpleLockProvider = SimpleLockProvider_1["default"];
// Interfaces
var types_1 = require("./types");
exports.Permission = types_1.Permission;
// Adapters
var LibraryAdministration_1 = __importDefault(require("./LibraryAdministration"));
exports.LibraryAdministration = LibraryAdministration_1["default"];
var fsImplementations = {
    DirectoryTemporaryFileStorage: DirectoryTemporaryFileStorage_1["default"],
    FileContentStorage: FileContentStorage_1["default"],
    FileLibraryStorage: FileLibraryStorage_1["default"],
    InMemoryStorage: InMemoryStorage_1["default"],
    JsonStorage: JsonStorage_1["default"]
};
exports.fsImplementations = fsImplementations;
var cacheImplementations = {
    CachedKeyValueStorage: CachedKeyValueStorage_1["default"],
    CachedLibraryStorage: CachedLibraryStorage_1["default"]
};
exports.cacheImplementations = cacheImplementations;
//# sourceMappingURL=index.js.map