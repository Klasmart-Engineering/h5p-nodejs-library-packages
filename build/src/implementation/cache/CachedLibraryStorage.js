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
        while (_) try {
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
exports.__esModule = true;
var cache_manager_1 = require("cache-manager");
var LibraryName_1 = __importDefault(require("../../LibraryName"));
var InstalledLibrary_1 = __importDefault(require("../../InstalledLibrary"));
/**
 * A wrapper around an actual library storage which adds caching and also
 * handles cache invalidation for you. You can use this method as a drop-in
 * replacement for other library storages.
 *
 * It uses [the NPM package
 * `cache-manager`](https://www.npmjs.com/package/cache-manager) to abstract the
 * caching, so you can pass in any of the store engines supported by it (e.g.
 * redis, mongodb, fs, memcached). See the documentation page of `cache-manager`
 * for more details.
 *
 * Note: If you construct `CachedLibraryStorage` without a cache, it will
 * default to an in-memory cache that **is not suitable for multi-process or
 * multi-machine setups**!
 */
var CachedLibraryStorage = /** @class */ (function () {
    /**
     * @param storage the uncached storage behind the cache
     * @param cache the cache to use; if undefined an in-memory cache will be
     * used; **IMPORTANT: The default in-memory cache does not with
     * multi-process or multi-machine setups!**
     */
    function CachedLibraryStorage(storage, cache, keyPrefix) {
        this.storage = storage;
        this.cache = cache;
        this.keyPrefix = keyPrefix;
        this.ADDONS_CACHE_KEY = 'addons';
        this.FILE_EXISTS_CACHE_KEY = 'exists';
        this.FILE_LIST = 'files';
        this.INSTALLED_LIBRARY_NAMES_CACHE_KEY = 'installed-library-names';
        this.JSON_CACHE_KEY = 'json';
        this.LANGUAGES_CACHE_KEY = 'languages';
        this.LIBRARY_IS_INSTALLED_CACHE_KEY = 'is-installed';
        this.METADATA_CACHE_KEY = 'metadata';
        this.STATS_CACHE_KEY = 'stats';
        this.STRING_CACHE_KEY = 'string';
        if (!this.cache) {
            this.cache = (0, cache_manager_1.caching)({
                store: 'memory',
                ttl: 60 * 60 * 24,
                max: Math.pow(2, 10)
            });
        }
        this.ADDONS_CACHE_KEY = keyPrefix + this.ADDONS_CACHE_KEY;
        this.INSTALLED_LIBRARY_NAMES_CACHE_KEY =
            keyPrefix + this.INSTALLED_LIBRARY_NAMES_CACHE_KEY;
    }
    CachedLibraryStorage.prototype.addFile = function (library, filename, readStream) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.addFile(library, filename, readStream)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.deleteFileCache(library, filename)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CachedLibraryStorage.prototype.addLibrary = function (libraryData, restricted) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = this.storage.addLibrary(libraryData, restricted);
                        return [4 /*yield*/, this.cache.del(this.INSTALLED_LIBRARY_NAMES_CACHE_KEY)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.ADDONS_CACHE_KEY)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.getCacheKeyForMetadata(libraryData, this.LIBRARY_IS_INSTALLED_CACHE_KEY))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.getCacheKeyForLibraryListByMachineName(libraryData.machineName))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.getCacheKeyForMetadata(libraryData, this.FILE_LIST))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Invalidates the whole cache.
     */
    CachedLibraryStorage.prototype.clearCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.reset()];
            });
        });
    };
    CachedLibraryStorage.prototype.clearFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.listFiles(library)];
                    case 1:
                        files = _a.sent();
                        return [4 /*yield*/, this.storage.clearFiles(library)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.getCacheKeyForMetadata(library, this.FILE_LIST))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return _this.deleteFileCache(library, file); }))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CachedLibraryStorage.prototype.deleteLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.listFiles(library)];
                    case 1:
                        files = _a.sent();
                        return [4 /*yield*/, this.storage.deleteLibrary(library)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(files
                                .map(function (file) { return _this.deleteFileCache(library, file); })
                                .concat([
                                this.cache.del(this.getCacheKeyForMetadata(library, this.METADATA_CACHE_KEY)),
                                this.cache.del(this.getCacheKeyForMetadata(library, this.LANGUAGES_CACHE_KEY)),
                                this.cache.del(this.getCacheKeyForMetadata(library, this.LIBRARY_IS_INSTALLED_CACHE_KEY)),
                                this.cache.del(this.INSTALLED_LIBRARY_NAMES_CACHE_KEY),
                                this.cache.del(this.getCacheKeyForLibraryListByMachineName(library.machineName)),
                                this.cache.del(this.ADDONS_CACHE_KEY),
                                this.cache.del(this.getCacheKeyForMetadata(library, this.FILE_LIST))
                            ]))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CachedLibraryStorage.prototype.fileExists = function (library, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.wrap(this.getCacheKeyForFile(library, filename, this.FILE_EXISTS_CACHE_KEY), function () { return _this.storage.fileExists(library, filename); })];
            });
        });
    };
    /**
     * Not cached as the function will be called only very rarely.
     */
    CachedLibraryStorage.prototype.getAllDependentsCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.storage.getAllDependentsCount()];
            });
        });
    };
    /**
     * Not cached as the function will be called only very rarely.
     */
    CachedLibraryStorage.prototype.getDependentsCount = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.storage.getDependentsCount(library)];
            });
        });
    };
    CachedLibraryStorage.prototype.getFileAsJson = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.wrap(this.getCacheKeyForFile(library, file, this.JSON_CACHE_KEY), function () { return _this.storage.getFileAsJson(library, file); })];
            });
        });
    };
    CachedLibraryStorage.prototype.getFileAsString = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.wrap(this.getCacheKeyForFile(library, file, this.STRING_CACHE_KEY), function () { return _this.storage.getFileAsString(library, file); })];
            });
        });
    };
    CachedLibraryStorage.prototype.getFileStats = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.wrap(this.getCacheKeyForFile(library, file, this.STATS_CACHE_KEY), function () { return _this.storage.getFileStats(library, file); })];
            });
        });
    };
    /**
     * We don't cache file streams, as this doesn't make much sense. A better
     * way to improve performance of files requested individually by the client
     * is to serve them statically, i.e. directly via Express or by offloading
     * them to S3 storage or a CDN.
     */
    CachedLibraryStorage.prototype.getFileStream = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.storage.getFileStream(library, file)];
            });
        });
    };
    CachedLibraryStorage.prototype.getInstalledLibraryNames = function (machineName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (machineName) {
                    return [2 /*return*/, this.cache.wrap(this.getCacheKeyForLibraryListByMachineName(machineName), function () { return _this.storage.getInstalledLibraryNames(machineName); })];
                }
                return [2 /*return*/, this.cache.wrap(this.INSTALLED_LIBRARY_NAMES_CACHE_KEY, function () {
                        return _this.storage.getInstalledLibraryNames();
                    })];
            });
        });
    };
    CachedLibraryStorage.prototype.getLanguages = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.wrap(this.getCacheKeyForMetadata(library, this.LANGUAGES_CACHE_KEY), function () { return _this.storage.getLanguages(library); })];
            });
        });
    };
    CachedLibraryStorage.prototype.getLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.wrap(this.getCacheKeyForMetadata(library, this.METADATA_CACHE_KEY), function () { return _this.storage.getLibrary(library); })];
                    case 1:
                        result = _a.sent();
                        // The ILibraryInterface contains methods, so we must construct an
                        // object with these methods if we obtained the data from the cache.
                        if (!result.compare) {
                            return [2 /*return*/, InstalledLibrary_1["default"].fromMetadata(result)];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CachedLibraryStorage.prototype.isInstalled = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.wrap(this.getCacheKeyForMetadata(library, this.LIBRARY_IS_INSTALLED_CACHE_KEY), function () { return _this.storage.isInstalled(library); })];
            });
        });
    };
    CachedLibraryStorage.prototype.listAddons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.storage.listAddons) {
                    return [2 /*return*/, this.cache.wrap(this.ADDONS_CACHE_KEY, function () {
                            return _this.storage.listAddons();
                        })];
                }
                return [2 /*return*/, []];
            });
        });
    };
    CachedLibraryStorage.prototype.listFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.wrap(this.getCacheKeyForMetadata(library, this.FILE_LIST), function () { return _this.storage.listFiles(library); })];
            });
        });
    };
    CachedLibraryStorage.prototype.updateAdditionalMetadata = function (library, additionalMetadata) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.updateAdditionalMetadata(library, additionalMetadata)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.cache.del(this.getCacheKeyForMetadata(library, this.METADATA_CACHE_KEY))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CachedLibraryStorage.prototype.updateLibrary = function (libraryMetadata) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.updateLibrary(libraryMetadata)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.cache.del(this.getCacheKeyForMetadata(libraryMetadata, this.METADATA_CACHE_KEY))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.INSTALLED_LIBRARY_NAMES_CACHE_KEY)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.ADDONS_CACHE_KEY)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.cache.del(this.getCacheKeyForLibraryListByMachineName(libraryMetadata.machineName))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CachedLibraryStorage.prototype.deleteFileCache = function (library, filename) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.cache.del(this.getCacheKeyForFile(library, filename, this.JSON_CACHE_KEY)),
                            this.cache.del(this.getCacheKeyForFile(library, filename, this.STRING_CACHE_KEY)),
                            this.cache.del(this.getCacheKeyForFile(library, filename, this.FILE_EXISTS_CACHE_KEY)),
                            this.cache.del(this.getCacheKeyForFile(library, filename, this.STATS_CACHE_KEY))
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CachedLibraryStorage.prototype.getCacheKeyForFile = function (library, filename, usage) {
        return "".concat(this.keyPrefix).concat(LibraryName_1["default"].toUberName(library), "/").concat(filename, "-").concat(usage);
    };
    CachedLibraryStorage.prototype.getCacheKeyForLibraryListByMachineName = function (machineName) {
        return "".concat(this.keyPrefix).concat(this.INSTALLED_LIBRARY_NAMES_CACHE_KEY, "-").concat(machineName);
    };
    CachedLibraryStorage.prototype.getCacheKeyForMetadata = function (library, usage) {
        return "".concat(this.keyPrefix).concat(LibraryName_1["default"].toUberName(library), "-").concat(usage);
    };
    return CachedLibraryStorage;
}());
exports["default"] = CachedLibraryStorage;
//# sourceMappingURL=CachedLibraryStorage.js.map