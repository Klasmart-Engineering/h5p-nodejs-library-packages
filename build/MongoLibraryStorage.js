"use strict";
/* eslint-disable no-underscore-dangle */
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
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var path = __importStar(require("path"));
var h5p_server_1 = require("@lumieducation/h5p-server");
var stream_buffers_1 = require("stream-buffers");
var log = new h5p_server_1.Logger('MongoLibraryStorage');
var MongoLibraryStorage = /** @class */ (function () {
    /**
     * @param mongodb a MongoDB collection (read- and writable)
     * @param options options
     */
    function MongoLibraryStorage(mongodb, options) {
        this.mongodb = mongodb;
        this.options = options;
        log.info('initialize');
    }
    /**
     * Adds a library file to a library. The library metadata must have been installed with addLibrary(...) first.
     * Throws an error if something unexpected happens. In this case the method calling addFile(...) will clean
     * up the partly installed library.
     * @param library The library that is being installed
     * @param filename Filename of the file to add, relative to the library root
     * @param readable The Readable containing the file content
     * @returns true if successful
     */
    MongoLibraryStorage.prototype.addFile = function (library, filename, readable) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateFilename(filename);
                        return [4 /*yield*/, this.readableToBuffer(readable)];
                    case 1:
                        buffer = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.mongodb.updateOne({
                                _id: h5p_server_1.LibraryName.toUberName(library)
                            }, {
                                $push: {
                                    files: {
                                        data: new mongodb_1.Binary(buffer),
                                        filename: filename,
                                        lastModified: new Date(Date.now()).getTime(),
                                        size: buffer.byteLength
                                    }
                                }
                            })];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        log.error("Error while adding file \"".concat(filename, "\" to MongoDB: ").concat(error_1.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:add-file-error', { ubername: h5p_server_1.LibraryName.toUberName(library), filename: filename }, 500);
                    case 5:
                        if (result.matchedCount !== 1) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', {
                                ubername: h5p_server_1.LibraryName.toUberName(library)
                            }, 404);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Adds the metadata of the library to the repository and assigns a new id
     * to the installed library. This id is used later when the library must be
     * referenced somewhere. Throws errors if something goes wrong.
     * @param libraryMetadata The library metadata object (= content of
     * library.json)
     * @param restricted True if the library can only be used be users allowed
     * to install restricted libraries.
     * @returns The newly created library object to use when adding library
     * files with addFile(...)
     */
    MongoLibraryStorage.prototype.addLibrary = function (libraryData, restricted) {
        return __awaiter(this, void 0, void 0, function () {
            var ubername, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ubername = h5p_server_1.LibraryName.toUberName(libraryData);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.insertOne({
                                _id: ubername,
                                metadata: libraryData,
                                additionalMetadata: { restricted: restricted },
                                files: []
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        log.error("Error adding library to MongoDB: ".concat(error_2.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-adding-metadata', {
                            details: error_2.message
                        });
                    case 4:
                        if (!result.acknowledged) {
                            log.error("Error adding library to MongoDB: Insert failed.");
                            throw new Error('mongo-library-storage:error-adding-metadata');
                        }
                        return [2 /*return*/, h5p_server_1.InstalledLibrary.fromMetadata(__assign(__assign({}, libraryData), { restricted: restricted }))];
                }
            });
        });
    };
    /**
     * Removes all files of a library. Doesn't delete the library metadata. (Used when updating libraries.)
     * @param library the library whose files should be deleted
     */
    MongoLibraryStorage.prototype.clearFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.mongodb.updateOne({
                                _id: h5p_server_1.LibraryName.toUberName(library)
                            }, {
                                $set: {
                                    files: []
                                }
                            })];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        log.error("There was an error while clearing the files: ".concat(error_3.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:deleting-files-error');
                    case 3:
                        if (result.matchedCount !== 1) {
                            log.error("Clearing files of library ".concat(h5p_server_1.LibraryName.toUberName(library), " failed, as it isn't installed."));
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', {
                                ubername: h5p_server_1.LibraryName.toUberName(library)
                            }, 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates indexes to speed up read access. Can be safely used even if
     * indexes already exist.
     */
    MongoLibraryStorage.prototype.createIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.mongodb.createIndexes([
                    {
                        key: {
                            _id: 1,
                            'files.filename': 1
                        }
                    },
                    {
                        key: {
                            'metadata.machineName': 1
                        }
                    },
                    {
                        key: {
                            'metadata.addTo': 1
                        }
                    }
                ]);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Removes the library and all its files from the repository.
     * Throws errors if something went wrong.
     * @param library The library to remove.
     */
    MongoLibraryStorage.prototype.deleteLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.mongodb.deleteOne({
                                _id: h5p_server_1.LibraryName.toUberName(library)
                            })];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-deleting', {
                            ubername: h5p_server_1.LibraryName.toUberName(library),
                            message: error_4.message
                        });
                    case 3:
                        if (result.deletedCount === 0) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if the library contains a file.
     * @param library The library to check
     * @param filename
     * @returns true if file exists in library, false otherwise
     */
    MongoLibraryStorage.prototype.fileExists = function (library, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var found, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateFilename(filename);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.findOne({
                                _id: h5p_server_1.LibraryName.toUberName(library),
                                'files.filename': filename
                            }, { projection: { _id: 1 } })];
                    case 2:
                        found = _a.sent();
                        return [2 /*return*/, !!found];
                    case 3:
                        error_5 = _a.sent();
                        log.error("Error checking if file ".concat(filename, " exists in library ").concat(h5p_server_1.LibraryName.toUberName(library), ": ").concat(error_5.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:file-exists-error', {
                            ubername: h5p_server_1.LibraryName.toUberName(library),
                            filename: filename
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Counts how often libraries are listed in the dependencies of other
     * libraries and returns a list of the number.
     *
     * Note: Implementations should not count circular dependencies that are
     * caused by editorDependencies. Example: H5P.InteractiveVideo has
     * H5PEditor.InteractiveVideo in its editor dependencies.
     * H5PEditor.Interactive video has H5P.InteractiveVideo in its preloaded
     * dependencies. In this case H5P.InteractiveVideo should get a dependency
     * count of 0 and H5PEditor.InteractiveVideo should have 1. That way it is
     * still possible to delete the library from storage.
     *
     * @returns an object with ubernames as key.
     * Example:
     * {
     *   'H5P.Example': 10
     * }
     * This means that H5P.Example is used by 10 other libraries.
     */
    MongoLibraryStorage.prototype.getAllDependentsCount = function () {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var libraryDeps, error_6, librariesDepsMap, _loop_1, _i, libraryDeps_1, lib, dependencies, _g, libraryDeps_2, lib, _h, _j, dependency, ubername;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.mongodb
                                .find({}, {
                                projection: {
                                    _id: 1,
                                    'metadata.machineName': 1,
                                    'metadata.majorVersion': 1,
                                    'metadata.minorVersion': 1,
                                    'metadata.preloadedDependencies': 1,
                                    'metadata.editorDependencies': 1,
                                    'metadata.dynamicDependencies': 1
                                }
                            })
                                .map(function (d) { return (__assign(__assign({}, d.metadata), { ubername: d._id })); })
                                .toArray()];
                    case 1:
                        libraryDeps = _k.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _k.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-dependents');
                    case 3:
                        librariesDepsMap = libraryDeps.reduce(function (prev, curr) {
                            prev[curr.ubername] = curr;
                            return prev;
                        }, {});
                        _loop_1 = function (lib) {
                            for (var _l = 0, _m = (_a = lib.editorDependencies) !== null && _a !== void 0 ? _a : []; _l < _m.length; _l++) {
                                var dependency = _m[_l];
                                var ubername = h5p_server_1.LibraryName.toUberName(dependency);
                                var index = (_b = librariesDepsMap[ubername].preloadedDependencies) === null || _b === void 0 ? void 0 : _b.findIndex(function (ln) {
                                    return h5p_server_1.LibraryName.equal(ln, lib);
                                });
                                if (index >= 0) {
                                    librariesDepsMap[ubername].preloadedDependencies.splice(index, 1);
                                }
                            }
                        };
                        // Remove circular dependencies caused by editor dependencies in
                        // content types like H5P.InteractiveVideo.
                        for (_i = 0, libraryDeps_1 = libraryDeps; _i < libraryDeps_1.length; _i++) {
                            lib = libraryDeps_1[_i];
                            _loop_1(lib);
                        }
                        dependencies = {};
                        for (_g = 0, libraryDeps_2 = libraryDeps; _g < libraryDeps_2.length; _g++) {
                            lib = libraryDeps_2[_g];
                            for (_h = 0, _j = ((_c = lib.preloadedDependencies) !== null && _c !== void 0 ? _c : [])
                                .concat((_d = lib.editorDependencies) !== null && _d !== void 0 ? _d : [])
                                .concat((_e = lib.dynamicDependencies) !== null && _e !== void 0 ? _e : []); _h < _j.length; _h++) {
                                dependency = _j[_h];
                                ubername = h5p_server_1.LibraryName.toUberName(dependency);
                                dependencies[ubername] = ((_f = dependencies[ubername]) !== null && _f !== void 0 ? _f : 0) + 1;
                            }
                        }
                        return [2 /*return*/, dependencies];
                }
            });
        });
    };
    /**
     * Returns the number of libraries that depend on this (single) library.
     * @param library the library to check
     * @returns the number of libraries that depend on this library.
     */
    MongoLibraryStorage.prototype.getDependentsCount = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.mongodb.countDocuments({
                                'metadata.preloadedDependencies': library
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-dependents', {
                            ubername: h5p_server_1.LibraryName.toUberName(library),
                            message: error_7.message
                        });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoLibraryStorage.prototype.getFileAsJson = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileAsString(library, file)];
                    case 1:
                        str = _a.sent();
                        return [2 /*return*/, JSON.parse(str)];
                }
            });
        });
    };
    MongoLibraryStorage.prototype.getFileAsString = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileStream(library, file)];
                    case 1:
                        stream = _a.sent();
                        return [2 /*return*/, (0, h5p_server_1.streamToString)(stream)];
                }
            });
        });
    };
    /**
     * Returns a information about a library file.
     * Throws an exception if the file does not exist.
     * @param library library
     * @param filename the relative path inside the library
     * @returns the file stats
     */
    MongoLibraryStorage.prototype.getFileStats = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileStats, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateFilename(file);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.findOne({
                                _id: h5p_server_1.LibraryName.toUberName(library),
                                'files.filename': file
                            }, {
                                projection: {
                                    _id: 1,
                                    files: {
                                        $elemMatch: { filename: file }
                                    }
                                }
                            })];
                    case 2:
                        fileStats = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        log.error("Error when getting stats from MongoDB: ".concat(error_8.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-stats', { ubername: h5p_server_1.LibraryName.toUberName(library), filename: file }, 500);
                    case 4:
                        if (!fileStats) {
                            throw new h5p_server_1.H5pError('library-file-missing', { ubername: h5p_server_1.LibraryName.toUberName(library), filename: file }, 404);
                        }
                        return [2 /*return*/, {
                                size: fileStats.files[0].size,
                                birthtime: new Date(fileStats.files[0].lastModified)
                            }];
                }
            });
        });
    };
    /**
     * Returns a readable stream of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param library library
     * @param filename the relative path inside the library
     * @returns a readable stream of the file's contents
     */
    MongoLibraryStorage.prototype.getFileStream = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileData, error_9, metadata, _a, _b, readable, readable;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.validateFilename(file);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.findOne({
                                _id: h5p_server_1.LibraryName.toUberName(library),
                                'files.filename': file
                            }, {
                                projection: {
                                    _id: 1,
                                    files: { $elemMatch: { filename: file } }
                                }
                            })];
                    case 2:
                        fileData = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _c.sent();
                        log.error("Error when getting file data from MongoDB: ".concat(error_9.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-file-data', { ubername: h5p_server_1.LibraryName.toUberName(library), filename: file }, 500);
                    case 4:
                        if (!!fileData) return [3 /*break*/, 7];
                        if (!(file === 'library.json')) return [3 /*break*/, 6];
                        _b = (_a = JSON).stringify;
                        return [4 /*yield*/, this.getMetadata(library)];
                    case 5:
                        metadata = _b.apply(_a, [_c.sent()]);
                        readable = new stream_buffers_1.ReadableStreamBuffer();
                        readable.put(metadata, 'utf-8');
                        readable.stop();
                        return [2 /*return*/, readable];
                    case 6: throw new h5p_server_1.H5pError('library-file-missing', {
                        ubername: h5p_server_1.LibraryName.toUberName(library),
                        filename: file
                    }, 404);
                    case 7:
                        readable = new stream_buffers_1.ReadableStreamBuffer();
                        readable.put(fileData.files[0].data.buffer);
                        readable.stop();
                        return [2 /*return*/, readable];
                }
            });
        });
    };
    /**
     * Returns all installed libraries or the installed libraries that have the
     * machine name.
     * @param machineName (optional) only return libraries that have this
     * machine name
     * @returns the libraries installed
     */
    MongoLibraryStorage.prototype.getInstalledLibraryNames = function (machineName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, list, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        result = this.mongodb.find(machineName
                            ? {
                                'metadata.machineName': machineName
                            }
                            : {}, {
                            projection: {
                                _id: 1
                            }
                        });
                        return [4 /*yield*/, result.toArray()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list
                                .map(function (e) {
                                try {
                                    return h5p_server_1.LibraryName.fromUberName(e._id);
                                }
                                catch (_a) {
                                    log.error("invalid ubername pattern in library storage id: ".concat(e._id, ". Ignoring..."));
                                    return undefined;
                                }
                            })
                                .filter(function (e) { return e; })];
                    case 2:
                        error_10 = _a.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-libraries', { details: error_10.message });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets a list of installed language files for the library.
     * @param library The library to get the languages for
     * @returns The list of JSON files in the language folder (without the extension .json)
     */
    MongoLibraryStorage.prototype.getLanguages = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var files, result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb
                                .aggregate([
                                {
                                    $match: {
                                        _id: h5p_server_1.LibraryName.toUberName(library)
                                    }
                                },
                                {
                                    $project: {
                                        files: {
                                            $filter: {
                                                input: '$files',
                                                cond: {
                                                    $regexMatch: {
                                                        input: '$$this.filename',
                                                        regex: /^language\//
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        files: {
                                            filename: 1
                                        }
                                    }
                                }
                            ])
                                .toArray()];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _a.sent();
                        log.error("There was an error while getting list of files from MongoDB: ".concat(error_11.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-languages');
                    case 4:
                        if (result.length === 0) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 404);
                        }
                        else if (result.length > 1) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:multiple-libraries', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 500);
                        }
                        files = result[0].files.map(function (f) { return f.filename; });
                        log.debug("Found ".concat(files.length, " file(s) in MongoDB."));
                        return [2 /*return*/, files
                                .filter(function (file) { return path.extname(file) === '.json'; })
                                .map(function (file) { return path.basename(file, '.json'); })];
                }
            });
        });
    };
    /**
     * Gets the information about an installed library
     * @param library the library
     * @returns the metadata and information about the locally installed library
     */
    MongoLibraryStorage.prototype.getLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!library) {
                            throw new Error('You must pass in a library name to getLibrary.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.findOne({ _id: h5p_server_1.LibraryName.toUberName(library) }, {
                                projection: {
                                    metadata: 1,
                                    additionalMetadata: 1
                                }
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_12 = _a.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-library-metadata', { ubername: h5p_server_1.LibraryName.toUberName(library) });
                    case 4:
                        if (!result) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 404);
                        }
                        if (!result.metadata || !result.additionalMetadata) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-library-metadata', { ubername: h5p_server_1.LibraryName.toUberName(library) });
                        }
                        return [2 /*return*/, h5p_server_1.InstalledLibrary.fromMetadata(__assign(__assign({}, result.metadata), result.additionalMetadata))];
                }
            });
        });
    };
    /**
     * Checks if a library is installed.
     * @param library the library to check
     * @returns true if the library is installed
     */
    MongoLibraryStorage.prototype.isInstalled = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var found;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mongodb.findOne({ _id: h5p_server_1.LibraryName.toUberName(library) }, { projection: { _id: 1 } })];
                    case 1:
                        found = _a.sent();
                        return [2 /*return*/, !!found];
                }
            });
        });
    };
    /**
     * Returns a list of library addons that are installed in the system.
     * Addons are libraries that have the property 'addTo' in their metadata.
     * ILibraryStorage implementation CAN but NEED NOT implement the method.
     * If it is not implemented, addons won't be available in the system.
     */
    MongoLibraryStorage.prototype.listAddons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.mongodb
                                .find({
                                'metadata.addTo': { $exists: true }
                            }, {
                                projection: {
                                    metadata: 1
                                }
                            })
                                .toArray()];
                    case 1: return [2 /*return*/, (_a.sent()).map(function (m) { return m.metadata; })];
                    case 2:
                        error_13 = _a.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-addons', {
                            message: error_13.message
                        });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets a list of all library files that exist for this library.
     * @param library
     * @returns all files that exist for the library
     */
    MongoLibraryStorage.prototype.listFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var files, result, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.findOne({
                                _id: h5p_server_1.LibraryName.toUberName(library)
                            }, {
                                projection: {
                                    _id: 1,
                                    files: {
                                        filename: 1
                                    }
                                }
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_14 = _a.sent();
                        log.error("Error listing all files of library ".concat(h5p_server_1.LibraryName.toUberName(library), ": ").concat(error_14.message));
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-listing-files', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 500);
                    case 4:
                        if (!result) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 404);
                        }
                        files = result.files.map(function (f) { return f.filename; }).concat(['library.json']);
                        log.debug("Found ".concat(files.length, " file(s) in MongoDB."));
                        return [2 /*return*/, files];
                }
            });
        });
    };
    /**
     * Updates the additional metadata properties that is added to the
     * stored libraries. This metadata can be used to customize behavior like
     * restricting libraries to specific users.
     *
     * Implementations should avoid updating the metadata if the additional
     * metadata if nothing has changed.
     * @param library the library for which the metadata should be updated
     * @param additionalMetadata the metadata to update
     * @returns true if the additionalMetadata object contained real changes
     * and if they were successfully saved; false if there were not changes.
     * Throws an error if saving was not possible.
     */
    MongoLibraryStorage.prototype.updateAdditionalMetadata = function (library, additionalMetadata) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!library) {
                            throw new Error('You must specify a library name when calling updateAdditionalMetadata.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.updateOne({ _id: h5p_server_1.LibraryName.toUberName(library) }, { $set: { additionalMetadata: additionalMetadata } })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_15 = _a.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:update-additional-metadata-error', {
                            ubername: h5p_server_1.LibraryName.toUberName(library),
                            message: error_15.message
                        });
                    case 4:
                        if (result.matchedCount !== 1) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 404);
                        }
                        return [2 /*return*/, result.modifiedCount === 1];
                }
            });
        });
    };
    /**
     * Updates the library metadata. This is necessary when updating to a new
     * patch version. After this clearFiles(...) is called by the LibraryManager
     * to remove all old files. The next step is to add the patched files with
     * addFile(...).
     * @param libraryMetadata the new library metadata
     * @returns The updated library object
     */
    MongoLibraryStorage.prototype.updateLibrary = function (libraryMetadata) {
        return __awaiter(this, void 0, void 0, function () {
            var ubername, result, error_16, additionalMetadata, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ubername = h5p_server_1.LibraryName.toUberName(libraryMetadata);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.updateOne({ _id: ubername }, { $set: { metadata: libraryMetadata } })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_16 = _a.sent();
                        throw new h5p_server_1.H5pError('mongo-library-storage:update-error', {
                            ubername: ubername,
                            message: error_16.message
                        });
                    case 4:
                        if (result.matchedCount === 0) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', { ubername: ubername }, 404);
                        }
                        if (result.modifiedCount !== 1) {
                            log.warn("Library ".concat(ubername, " not updated as metadata has remained the same."));
                        }
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.mongodb.findOne({ _id: ubername }, { projection: { additionalMetadata: 1 } })];
                    case 6:
                        additionalMetadata = (_a.sent());
                        return [3 /*break*/, 8];
                    case 7:
                        error_17 = _a.sent();
                        log.warn("Could not get additional metadata for library ".concat(ubername));
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, h5p_server_1.InstalledLibrary.fromMetadata(__assign(__assign({}, libraryMetadata), (additionalMetadata !== null && additionalMetadata !== void 0 ? additionalMetadata : {})))];
                }
            });
        });
    };
    /**
     * Gets the the metadata of a library. In contrast to getLibrary this is
     * only the metadata.
     * @param library the library
     * @returns the metadata about the locally installed library
     */
    MongoLibraryStorage.prototype.getMetadata = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!library) {
                            throw new Error('You must pass in a library name to getLibrary.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mongodb.findOne({ _id: h5p_server_1.LibraryName.toUberName(library) }, {
                                projection: {
                                    metadata: 1
                                }
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_18 = _a.sent();
                        console.log(error_18);
                        throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-library-metadata', { ubername: h5p_server_1.LibraryName.toUberName(library) });
                    case 4:
                        if (!result) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:library-not-found', { ubername: h5p_server_1.LibraryName.toUberName(library) }, 404);
                        }
                        if (!result.metadata) {
                            throw new h5p_server_1.H5pError('mongo-library-storage:error-getting-library-metadata', { ubername: h5p_server_1.LibraryName.toUberName(library) });
                        }
                        return [2 /*return*/, result.metadata];
                }
            });
        });
    };
    MongoLibraryStorage.prototype.readableToBuffer = function (readable) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var chunks = [];
                        readable.on('data', function (chunk) { return chunks.push(Buffer.from(chunk)); });
                        readable.on('end', function () { return resolve(Buffer.concat(chunks)); });
                    })];
            });
        });
    };
    MongoLibraryStorage.prototype.validateFilename = function (filename) { };
    return MongoLibraryStorage;
}());
exports["default"] = MongoLibraryStorage;
//# sourceMappingURL=MongoLibraryStorage.js.map