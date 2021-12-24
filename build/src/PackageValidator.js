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
var ajv_1 = __importDefault(require("ajv"));
var ajv_keywords_1 = __importDefault(require("ajv-keywords"));
var path = __importStar(require("path"));
var yauzlPromise = __importStar(require("yauzl-promise"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var upath_1 = __importDefault(require("upath"));
var get_all_files_1 = require("get-all-files");
var AggregateH5pError_1 = __importDefault(require("./helpers/AggregateH5pError"));
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var StringFormatter_1 = require("./helpers/StringFormatter");
var ValidatorBuilder_1 = require("./helpers/ValidatorBuilder");
var LibraryName_1 = __importDefault(require("./LibraryName"));
var log = new Logger_1["default"]('PackageValidator');
/**
 * Performs checks if uploaded H5P packages or those from the H5P Hub are valid.
 * Call await validatePackage(...) to perform these checks.
 *
 * The validator currently does not check if all necessary library versions will
 * be present after performing an upgrade (done in ll. 968 - 1032 of
 * h5p.classes.php). This is not done because it would require enumerating all
 * installed libraries and this is not possible in the extractor without
 * introducing a dependency to the core.
 *
 * REMARK: Note that the validator operates on zip files and thus has to use
 * slashes (/) in paths regardless of the operating system!
 */
var PackageValidator = /** @class */ (function () {
    /**
     * @param configurationValues Object containing all required configuration
     * parameters
     */
    function PackageValidator(config, libraryManager) {
        var _this = this;
        this.config = config;
        this.libraryManager = libraryManager;
        this.languageFileRegex = /^(-?[a-z]+){1,7}\.json$/i;
        this.libraryDirectoryNameRegex = /^[\w0-9\-.]{1,255}$/i;
        /**
         * Checks file sizes (single files and all files combined) Does NOT throw
         * errors but appends them to the error object.
         * @param zipEntries The entries inside the h5p file
         * @param error The error object to use
         * @returns The unchanged zip entries
         */
        this.fileSizeMustBeWithinLimits = function (zipEntries, pathPrefix, error) { return __awaiter(_this, void 0, void 0, function () {
            var totalFileSize, _i, zipEntries_1, entry;
            return __generator(this, function (_a) {
                log.debug("checking if file sizes exceed limit");
                totalFileSize = 0;
                if (this.config.maxFileSize) {
                    for (_i = 0, zipEntries_1 = zipEntries; _i < zipEntries_1.length; _i++) {
                        entry = zipEntries_1[_i];
                        totalFileSize += entry.uncompressedSize;
                        if (entry.uncompressedSize > this.config.maxFileSize) {
                            log.error("file ".concat(entry.fileName, " exceeds limit"));
                            error.addError(new H5pError_1["default"]('file-size-too-large', {
                                file: entry.fileName,
                                max: (0, StringFormatter_1.formatBytes)(this.config.maxFileSize),
                                used: (0, StringFormatter_1.formatBytes)(entry.uncompressedSize)
                            }));
                        }
                    }
                }
                if (this.config.maxTotalSize &&
                    totalFileSize > this.config.maxTotalSize) {
                    log.error("total size is too large");
                    error.addError(new H5pError_1["default"]('total-size-too-large', {
                        max: (0, StringFormatter_1.formatBytes)(this.config.maxTotalSize),
                        used: (0, StringFormatter_1.formatBytes)(totalFileSize)
                    }));
                }
                return [2 /*return*/, zipEntries];
            });
        }); };
        /**
         * Validates the libraries inside the package.
         * @param filenames The entries inside the h5p file
         * @param error The error object to use
         * @returns The unchanged zip entries
         */
        this.librariesMustBeValid = function (skipInstalledLibraries) {
            return function (filenames, pathPrefix, error) { return __awaiter(_this, void 0, void 0, function () {
                var topLevelDirectories;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // TODO: continue here
                            log.debug("validating libraries inside package");
                            return [4 /*yield*/, PackageValidator.getTopLevelDirectories(pathPrefix)];
                        case 1:
                            topLevelDirectories = _a.sent();
                            return [4 /*yield*/, Promise.all(topLevelDirectories
                                    .filter(function (directory) { return directory !== 'content'; })
                                    .map(function (directory) {
                                    return _this.validateLibrary(filenames, directory, pathPrefix, error, skipInstalledLibraries);
                                }))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, filenames];
                    }
                });
            }); };
        };
        /**
         * Checks if the language files in the library have the correct naming
         * schema and are valid JSON.
         * @param filenames zip entries in the package
         * @param jsonData jsonData of the library.json file.
         * @param error The error object to use
         * @returns the unchanged data passed to the rule
         */
        this.libraryLanguageFilesMustBeValid = function (_a, pathPrefix, error) {
            var filenames = _a.filenames, jsonData = _a.jsonData;
            return __awaiter(_this, void 0, void 0, function () {
                var uberName, languagePath, _i, _b, languageFile, languageFileName, ignored_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            log.debug("checking if language files in library ".concat(jsonData.machineName, "-").concat(jsonData.majorVersion, ".").concat(jsonData.minorVersion, " have the correct naming schema and are valid JSON"));
                            uberName = "".concat(jsonData.machineName, "-").concat(jsonData.majorVersion, ".").concat(jsonData.minorVersion);
                            languagePath = upath_1["default"].join(uberName, 'language/');
                            _i = 0, _b = filenames.filter(function (f) {
                                return f.startsWith(languagePath);
                            });
                            _c.label = 1;
                        case 1:
                            if (!(_i < _b.length)) return [3 /*break*/, 6];
                            languageFile = _b[_i];
                            languageFileName = path.basename(languageFile);
                            if (!this.languageFileRegex.test(languageFileName)) {
                                log.error("".concat(jsonData.machineName, "-").concat(jsonData.majorVersion, ".").concat(jsonData.minorVersion, ": invalid language file"));
                                error.addError(new H5pError_1["default"]('invalid-language-file', {
                                    file: languageFileName,
                                    library: uberName
                                }));
                            }
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.tryParseJson(path.join(pathPrefix, languageFile))];
                        case 3:
                            _c.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            ignored_1 = _c.sent();
                            log.error("".concat(jsonData.machineName, "-").concat(jsonData.majorVersion, ".").concat(jsonData.minorVersion, ": language json could not be parsed"));
                            error.addError(new H5pError_1["default"]('invalid-language-file-json', {
                                file: languageFileName,
                                library: uberName
                            }));
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, { filenames: filenames, jsonData: jsonData }];
                    }
                });
            });
        };
        this.skipInstalledLibraries = function (skipInstalledLibraries) {
            return function (_a, pathPrefix, error) {
                var filenames = _a.filenames, jsonData = _a.jsonData;
                return __awaiter(_this, void 0, void 0, function () {
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                log.debug("Checking if library can be skipped");
                                _c = skipInstalledLibraries;
                                if (!_c) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.libraryManager.libraryExists(jsonData)];
                            case 1:
                                _c = (_d.sent());
                                _d.label = 2;
                            case 2:
                                _b = _c;
                                if (!_b) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.libraryManager.isPatchedLibrary(jsonData)];
                            case 3:
                                _b = !(_d.sent());
                                _d.label = 4;
                            case 4:
                                if (_b) {
                                    log.debug("Skipping already installed library ".concat(LibraryName_1["default"].toUberName(jsonData)));
                                    return [2 /*return*/, undefined];
                                }
                                return [2 /*return*/, { jsonData: jsonData, filenames: filenames }];
                        }
                    });
                });
            };
        };
        /**
         * Checks if all JavaScript and CSS file references in the preloaded section
         * of the library metadata are present in the package.
         * @param filenames zip entries in the package
         * @param jsonData data of the library.json file.
         * @param error The error object to use
         * @returns {Promise<{filenames: string[], jsonData: any}>} the unchanged
         * data passed to the rule
         */
        this.libraryPreloadedFilesMustExist = function (_a, pathPrefix, error) {
            var filenames = _a.filenames, jsonData = _a.jsonData;
            return __awaiter(_this, void 0, void 0, function () {
                var uberName;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            log.debug("checking if all js and css file references in the preloaded section of the library metadata are present in package");
                            uberName = "".concat(jsonData.machineName, "-").concat(jsonData.majorVersion, ".").concat(jsonData.minorVersion);
                            if (!jsonData.preloadedJs) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.all(jsonData.preloadedJs.map(function (file) {
                                    return _this.fileMustExist(upath_1["default"].join(uberName, file.path), 'library-file-missing', false, { filename: file.path, library: uberName })(filenames, pathPrefix, error);
                                }))];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            if (!jsonData.preloadedCss) return [3 /*break*/, 4];
                            return [4 /*yield*/, Promise.all(jsonData.preloadedCss.map(function (file) {
                                    return _this.fileMustExist(upath_1["default"].join(uberName, file.path), 'library-file-missing', false, { filename: file.path, library: uberName })(filenames, pathPrefix, error);
                                }))];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, { filenames: filenames, jsonData: jsonData }];
                    }
                });
            });
        };
        /**
         * Checks if a library is compatible to the core version running. Does not
         * throw a ValidationError.
         * @param filenames zip entries in the package
         * @param jsonData jsonData of the library.json file.
         * @param error The error object to use
         * @returns the unchanged data passed to the rule
         */
        this.mustBeCompatibleToCoreVersion = function (_a, pathPrefix, error) {
            var filenames = _a.filenames, jsonData = _a.jsonData;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    log.debug("checking if library is compatible with the core version running");
                    this.checkCoreVersion(jsonData, "".concat(jsonData.machineName, "-").concat(jsonData.majorVersion, ".").concat(jsonData.minorVersion), error);
                    return [2 /*return*/, { filenames: filenames, jsonData: jsonData }];
                });
            });
        };
        log.debug("initialize");
        this.contentExtensionWhitelist = config.contentWhitelist.split(' ');
        this.libraryExtensionWhitelist = config.libraryWhitelist
            .split(' ')
            .concat(this.contentExtensionWhitelist);
    }
    /**
     * Returns a list of top-level directories in the directory
     * @param pathPrefix the path of the parent directory
     * @returns list of top-level directories
     */
    PackageValidator.getTopLevelDirectories = function (pathPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.verbose("getting top level directories");
                        return [4 /*yield*/, fs_extra_1["default"].readdir(pathPrefix, { withFileTypes: true })];
                    case 1: return [2 /*return*/, (_a.sent())
                            .filter(function (dirent) { return dirent.isDirectory(); })
                            .map(function (dirent) { return dirent.name; })];
                }
            });
        });
    };
    /**
     * Checks if the passed filename has an extension that is in the passed list.
     * @param filename The filename to check
     * @param allowedExtensions A list of extensions to check against
     */
    PackageValidator.isAllowedFileExtension = function (filename, allowedExtensions) {
        log.verbose("checking allowed file extension: ".concat(filename, " - allowed extensions: ").concat(allowedExtensions.join(', ')));
        var actualExtension = path.extname(filename);
        if (actualExtension === '') {
            return false;
        }
        actualExtension = actualExtension.substr(1);
        if (allowedExtensions.some(function (allowedExtension) { return allowedExtension === actualExtension; })) {
            return true;
        }
        return false;
    };
    /**
     * Opens the zip archive.
     * @param file Path to file to open
     * @returns Zip archive object or undefined if zip file cannot be opened.
     */
    PackageValidator.openZipArchive = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var ignored_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        log.debug("opening zip archive ".concat(file));
                        return [4 /*yield*/, yauzlPromise.open(file, { lazyEntries: false })];
                    case 1: 
                    // we await the promise here because we want to catch the error and
                    // return undefined
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        ignored_2 = _a.sent();
                        log.error("zip file ".concat(file, " could not be opened: ").concat(ignored_2));
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PackageValidator.prototype.validateFileSizes = function (h5pFile) {
        return __awaiter(this, void 0, void 0, function () {
            var zipArchive, result, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        log.debug("validating file sizes in ".concat(h5pFile));
                        return [4 /*yield*/, PackageValidator.openZipArchive(h5pFile)];
                    case 1:
                        zipArchive = _c.sent();
                        if (!zipArchive) {
                            log.error("zip archive not valid");
                            throw new H5pError_1["default"]('unable-to-unzip', {}, 400);
                        }
                        _b = (_a = new ValidatorBuilder_1.ValidatorBuilder()
                            .addRule(this.fileSizeMustBeWithinLimits)
                            .addRule(ValidatorBuilder_1.throwErrorsNowRule)
                            .addRule(this.returnTrue))
                            .validate;
                        return [4 /*yield*/, zipArchive.readEntries()];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(), ''])];
                    case 3:
                        result = _c.sent();
                        return [4 /*yield*/, zipArchive.close()];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Validates the H5P package located at the path passed to the method.
     * @param h5pFile Path to H5P file to validate
     * @param checkContent If true, the method will check if the content in the
     * package conforms to the standard
     * @param checkLibraries If true, the method will check if the libraries in
     * the package conform to the standard
     * @returns true if the package is valid. Will throw Errors with the error
     * in Error.message if there is a validation error.
     */
    PackageValidator.prototype.validateExtractedPackage = function (packagePath, checkContent, checkLibraries, skipInstalledLibraries) {
        if (checkContent === void 0) { checkContent = true; }
        if (checkLibraries === void 0) { checkLibraries = true; }
        if (skipInstalledLibraries === void 0) { skipInstalledLibraries = true; }
        return __awaiter(this, void 0, void 0, function () {
            var packagePathLength, files, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("validating package in directory ".concat(packagePath));
                        return [4 /*yield*/, this.initializeJsonValidators()];
                    case 1:
                        _a.sent();
                        packagePathLength = packagePath.length + 1;
                        return [4 /*yield*/, (0, get_all_files_1.getAllFiles)(packagePath).toArray()];
                    case 2:
                        files = (_a.sent()).map(function (f) {
                            return upath_1["default"].toUnix(f.substr(packagePathLength));
                        });
                        return [4 /*yield*/, new ValidatorBuilder_1.ValidatorBuilder()
                                .addRule(this.filterOutEntries(function (filename) {
                                return path.basename(filename).startsWith('.') ||
                                    path.basename(filename).startsWith('_');
                            }))
                                .addRuleWhen(this.fileExtensionMustBeAllowed(function (name) { return name.startsWith('content/'); }, this.contentExtensionWhitelist), checkContent)
                                .addRuleWhen(this.fileExtensionMustBeAllowed(function (name) {
                                return name.includes('/') && !name.startsWith('content/');
                            }, this.libraryExtensionWhitelist), checkLibraries)
                                .addRuleWhen(this.fileMustExist('h5p.json', 'invalid-h5p-json-file', true), checkContent)
                                .addRuleWhen(this.jsonMustConformToSchema('h5p.json', this.h5pMetadataValidator, 'invalid-h5p-json-file-2', 'unable-to-parse-package', undefined, {
                                filename: 'h5p.json'
                            }), checkContent)
                                .addRuleWhen(this.fileMustExist('content/content.json', 'invalid-content-folder', true), checkContent)
                                .addRuleWhen(this.jsonMustBeParsable('content/content.json', 'unable-to-parse-package', undefined, undefined, { filename: 'content/content.json' }), checkContent)
                                .addRule(ValidatorBuilder_1.throwErrorsNowRule)
                                .addRuleWhen(this.librariesMustBeValid(skipInstalledLibraries), checkLibraries)
                                .addRule(ValidatorBuilder_1.throwErrorsNowRule)
                                .addRule(this.returnTrue)
                                .validate(files, packagePath)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Checks if the core API version required in the metadata can be satisfied
     * by the running instance.
     * @param metadata The object containing information about the required core
     * version
     * @param libraryName The name of the library that is being checked.
     * @param error The error object.
     * @returns true if the core API required in the metadata can be satisfied
     * by the running instance. Also true if the metadata doesn't require any
     * core API version.
     */
    PackageValidator.prototype.checkCoreVersion = function (metadata, libraryName, error) {
        log.debug("checking core version for ".concat(libraryName));
        if (!metadata.coreApi ||
            !metadata.coreApi.majorVersion ||
            !metadata.coreApi.minorVersion) {
            return true;
        }
        if (metadata.coreApi.majorVersion > this.config.coreApiVersion.major ||
            (metadata.coreApi.majorVersion ===
                this.config.coreApiVersion.major &&
                metadata.coreApi.minorVersion >
                    this.config.coreApiVersion.minor)) {
            log.error("api version ".concat(metadata.coreApi.majorVersion, ".").concat(metadata.coreApi.minorVersion, " for ").concat(libraryName, " not supported"));
            error.addError(new H5pError_1["default"]('api-version-unsupported', {
                component: libraryName,
                current: "".concat(this.config.coreApiVersion.major, ".").concat(this.config.coreApiVersion.minor),
                required: "".concat(metadata.coreApi.majorVersion, ".").concat(metadata.coreApi.minorVersion)
            }, 400));
        }
        return true;
    };
    /**
     * Factory for the file extension rule: Checks if the file extensions of the
     * files in the array are in the whitelists. Does NOT throw errors but
     * appends them to the error object.
     * @param filter The filter function must return true if the filename passed
     * to it should be checked
     * @param whitelist The file extensions that are allowed for files that
     * match the filter
     * @returns the rule
     */
    PackageValidator.prototype.fileExtensionMustBeAllowed = function (filter, whitelist) {
        var _this = this;
        return function (filenames, pathPrefix, error) { return __awaiter(_this, void 0, void 0, function () {
            var _i, filenames_1, filename, lowercaseName;
            return __generator(this, function (_a) {
                for (_i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
                    filename = filenames_1[_i];
                    lowercaseName = filename.toLocaleLowerCase();
                    // Skip files that aren't matched by the filter and directories
                    if (filter(lowercaseName) &&
                        !PackageValidator.isAllowedFileExtension(lowercaseName, whitelist)) {
                        log.error("file extension ".concat(filename, " is not in whitelist: ").concat(whitelist.join(', ')));
                        error.addError(new H5pError_1["default"]('not-in-whitelist', {
                            filename: filename,
                            'files-allowed': this.contentExtensionWhitelist.join(' ')
                        }));
                    }
                }
                return [2 /*return*/, filenames];
            });
        }); };
    };
    /**
     * Factory for a rule that makes sure that a certain file must exist. Does
     * NOT throw errors but appends them to the error object.
     * @param filename The filename that must exist among the zip entries (path,
     * not case-sensitive)
     * @param errorId The error message that is used if the file does not exist
     * @param throwOnError (optional) If true, the rule will throw an error if
     * the file does not exist.
     * @param errorReplacements (optional) The replacement variables to pass to
     * the error.
     * @returns the rule
     */
    PackageValidator.prototype.fileMustExist = function (filename, errorId, throwOnError, errorReplacements) {
        var _this = this;
        if (throwOnError === void 0) { throwOnError = false; }
        if (errorReplacements === void 0) { errorReplacements = {}; }
        return function (filenames, pathPrefix, error) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.debug("checking if file ".concat(filename, " exists"));
                if (!filenames.find(function (e) {
                    return e.toLocaleLowerCase() === filename.toLocaleLowerCase();
                })) {
                    log.error("file ".concat(filename, " does not exist"));
                    error.addError(new H5pError_1["default"](errorId, errorReplacements));
                    if (throwOnError) {
                        throw error;
                    }
                }
                return [2 /*return*/, filenames];
            });
        }); };
    };
    /**
     * Factory for a rule that filters out files from the validation.
     * @param filter The filter. Filenames matched by this filter will be
     * filtered out.
     * @returns the rule
     */
    PackageValidator.prototype.filterOutEntries = function (filter) {
        var _this = this;
        /**
         * @param filenames The files in the package in temporary storage
         * @returns the filtered out filesnames
         */
        return function (filenames) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, filenames.filter(function (e) { return !filter(e); })];
        }); }); };
    };
    /**
     * Initializes the JSON schema validators _h5pMetaDataValidator and
     * _libraryMetadataValidator. Can be called multiple times, as it only
     * creates new validators when it hasn't been called before.
     */
    PackageValidator.prototype.initializeJsonValidators = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jsonValidator, h5pJsonSchema, libraryNameSchema, librarySchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.h5pMetadataValidator && this.libraryMetadataValidator) {
                            return [2 /*return*/];
                        }
                        log.debug("initializing json validators");
                        jsonValidator = new ajv_1["default"]();
                        (0, ajv_keywords_1["default"])(jsonValidator, 'regexp');
                        return [4 /*yield*/, fs_extra_1["default"].readJSON(path.join(__dirname, 'schemas/h5p-schema.json'))];
                    case 1:
                        h5pJsonSchema = _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].readJSON(path.join(__dirname, 'schemas/library-name-schema.json'))];
                    case 2:
                        libraryNameSchema = _a.sent();
                        return [4 /*yield*/, fs_extra_1["default"].readJSON(path.join(__dirname, 'schemas/library-schema.json'))];
                    case 3:
                        librarySchema = _a.sent();
                        jsonValidator.addSchema([
                            h5pJsonSchema,
                            libraryNameSchema,
                            librarySchema
                        ]);
                        this.h5pMetadataValidator = jsonValidator.compile(h5pJsonSchema);
                        this.libraryMetadataValidator = jsonValidator.compile(librarySchema);
                        log.debug('Json validators initialized');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Factory for a rule that makes sure a JSON file is parsable. Throws an
     * error if the JSON file can't be parsed.
     * @param filename The path to the file.
     * @param errorId An optional error message to use instead of the default
     * @param skipIfNonExistent if true, the rule does not produce an error if
     * the file doesn't exist.
     * @param throwIfError if true, the rule will throw an error if the JSON
     * file is not parsable, otherwise it will append the error message to the
     * error object
     * @param errorReplacements replacements to use when generating the an error
     * @return The rule
     */
    PackageValidator.prototype.jsonMustBeParsable = function (filename, errorId, skipIfNonExistent, throwIfError, errorReplacements) {
        var _this = this;
        if (skipIfNonExistent === void 0) { skipIfNonExistent = false; }
        if (throwIfError === void 0) { throwIfError = true; }
        if (errorReplacements === void 0) { errorReplacements = {}; }
        return function (filenames, pathPrefix, error) { return __awaiter(_this, void 0, void 0, function () {
            var file, jsonParseError_1, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("checking if json of ".concat(filename, " is parsable"));
                        file = filenames.find(function (e) { return e.toLocaleLowerCase() === filename.toLocaleLowerCase(); });
                        if (!file) {
                            if (skipIfNonExistent) {
                                return [2 /*return*/, filenames];
                            }
                            log.error("File ".concat(filename, " missing from H5P package. Make sure to use the fileMustExistRule before using jsonMustBeParsableRule!"));
                            throw new Error("File ".concat(filename, " missing from H5P package. Make sure to use the fileMustExistRule before using jsonMustBeParsableRule!"));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1["default"].readJSON(path.join(pathPrefix, file))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        jsonParseError_1 = _a.sent();
                        log.error("json ".concat(filename, " is not parsable"));
                        err = new H5pError_1["default"](errorId || jsonParseError_1.errorId, errorId ? errorReplacements : jsonParseError_1.replacements, 400, jsonParseError_1.debugMessage);
                        if (throwIfError) {
                            throw error.addError(err);
                        }
                        else {
                            error.addError(err);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, filenames];
                }
            });
        }); };
    };
    /**
     * Factory for a rule that makes sure a JSON file is parsable and conforms
     * to the specified JSON schema. Throws an error if the JSON file can't be
     * parsed or if it does not conform to the schema.
     * @param filename The path to the file.
     * @param schemaValidator The validator for the required schema.
     * @param errorIdAnyError The id of the message that is emitted, when there
     * is an error. (Allowed placeholders: %name, %reason)
     * @param errorIdJsonParse (optional) The message to output if the JSON file
     * is not parsable (will default to a generíc error message)
     * @param returnContent (optional) If true, the rule will return an object
     * with { filenames, jsonData } where jsonData contains the parsed JSON of
     * the file
     * @param errorReplacements (optional) The replacements to pass to error
     * objects created in the method.
     * @return The rule (return value: An array of filenames if returnContent ==
     * false, otherwise the JSON content is added to the return object)
     */
    PackageValidator.prototype.jsonMustConformToSchema = function (filename, schemaValidator, errorIdAnyError, errorIdJsonParse, returnContent, errorReplacements) {
        var _this = this;
        if (returnContent === void 0) { returnContent = false; }
        if (errorReplacements === void 0) { errorReplacements = {}; }
        return function (filenames, pathPrefix, error) { return __awaiter(_this, void 0, void 0, function () {
            var file, jsonData, jsonParseError_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("checking if json ".concat(filename, " conforms to schema"));
                        file = filenames.find(function (e) { return e.toLocaleLowerCase() === filename.toLocaleLowerCase(); });
                        if (!file) {
                            log.error("File ".concat(filename, " missing from H5P package. Make sure to use the fileMustExistRule before using jsonMustConformToSchemaRule!"));
                            throw new Error("File ".concat(filename, " missing from H5P package. Make sure to use the fileMustExistRule before using jsonMustConformToSchemaRule!"));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1["default"].readJSON(path.join(pathPrefix, file))];
                    case 2:
                        jsonData = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        jsonParseError_2 = _a.sent();
                        log.error("".concat(errorIdJsonParse || jsonParseError_2.message));
                        throw error.addError(new H5pError_1["default"](errorIdJsonParse || jsonParseError_2.errorId, errorIdJsonParse
                            ? errorReplacements
                            : jsonParseError_2.replacements, 400));
                    case 4:
                        if (!schemaValidator(jsonData)) {
                            log.error("json ".concat(filename, " does not conform to schema"));
                            errorReplacements.reason = schemaValidator.errors
                                .map(function (e) { return "".concat(e.instancePath, " ").concat(e.message); })
                                .join(' ')
                                .trim();
                            throw error.addError(new H5pError_1["default"](errorIdAnyError, errorReplacements));
                        }
                        if (!returnContent) {
                            return [2 /*return*/, filenames];
                        }
                        return [2 /*return*/, { filenames: filenames, jsonData: jsonData }];
                }
            });
        }); };
    };
    /**
     * Factory for a rule that checks if library's directory conforms to naming
     * standards
     * @param libraryName The name of the library (directory)
     * @returns the rule
     */
    PackageValidator.prototype.libraryDirectoryMustHaveValidName = function (libraryName) {
        var _this = this;
        log.debug("validating library's directory to naming standards");
        return function (filenames, pathPrefix, error) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.libraryDirectoryNameRegex.test(libraryName)) {
                    throw error.addError(new H5pError_1["default"]('invalid-library-name', {
                        name: libraryName
                    }));
                }
                return [2 /*return*/, filenames];
            });
        }); };
    };
    /**
     * Factory for a check that makes sure that the directory name of the
     * library matches the name in the library.json metadata. Does not throw a
     * ValidationError.
     * @param directoryName the name of the directory in the package this
     * library is in
     * @returns the rule
     */
    PackageValidator.prototype.libraryMustHaveMatchingDirectoryName = function (directoryName) {
        var _this = this;
        /**
         * @param filenames zip entries in the package
         * @param jsonData jsonData of the library.json file
         * @param error The error object to use
         * @returns {Promise<{filenames: yauzl.Entry[], jsonData: any}>} the unchanged data passed to the rule
         */
        log.debug("checking if directory names ".concat(directoryName, " of libraries match library.json metadata"));
        return function (_a, pathPrefix, error) {
            var filenames = _a.filenames, jsonData = _a.jsonData;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    // Library's directory name must be:
                    // - <machineName>
                    //     - or -
                    // - <machineName>-<majorVersion>.<minorVersion> where machineName,
                    //   majorVersion and minorVersion is read from library.json
                    if (directoryName !== jsonData.machineName &&
                        directoryName !==
                            "".concat(jsonData.machineName, "-").concat(jsonData.majorVersion, ".").concat(jsonData.minorVersion)) {
                        log.error("library directory does not match name ".concat(directoryName));
                        error.addError(new H5pError_1["default"]('library-directory-name-mismatch', {
                            directoryName: directoryName,
                            machineName: jsonData.machineName,
                            majorVersion: jsonData.majorVersion,
                            minorVersion: jsonData.minorVersion
                        }));
                    }
                    return [2 /*return*/, { filenames: filenames, jsonData: jsonData }];
                });
            });
        };
    };
    /**
     * A rule that always returns true.
     */
    PackageValidator.prototype.returnTrue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    /**
     * Tries to open the file in the ZIP archive in memory and parse it as JSON.
     * Will throw errors if the file cannot be read or is no valid JSON.
     * @param filename The entry to read
     * @returns The read JSON as an object
     */
    PackageValidator.prototype.tryParseJson = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var ignored_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.verbose("parsing json ".concat(filename));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1["default"].readJson(filename)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ignored_3 = _a.sent();
                        log.error("unable to parse JSON file ".concat(filename));
                        throw new H5pError_1["default"]('unable-to-parse-package', {
                            fileName: filename
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks whether the library conforms to the standard and returns its data.
     * @param filenames All (relevant) zip entries of the package.
     * @param ubername The name of the library to check
     * @param error the error object
     * @returns the object from library.json with additional data from
     * semantics.json, the language files and the icon.
     */
    PackageValidator.prototype.validateLibrary = function (filenames, ubername, pathPrefix, error, skipInstalledLibraries) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        log.debug("validating library ".concat(ubername));
                        return [4 /*yield*/, new ValidatorBuilder_1.ValidatorBuilder()
                                .addRule(this.libraryDirectoryMustHaveValidName(ubername))
                                .addRule(this.jsonMustBeParsable('semantics.json', 'invalid-semantics-json-file', true, false, { name: ubername }))
                                .addRule(this.jsonMustConformToSchema("".concat(ubername, "/library.json"), this.libraryMetadataValidator, 'invalid-schema-library-json-file', 'invalid-library-json-file', true, { name: ubername }))
                                .addRule(this.skipInstalledLibraries(skipInstalledLibraries))
                                .addRule(this.mustBeCompatibleToCoreVersion)
                                .addRule(this.libraryMustHaveMatchingDirectoryName(ubername))
                                .addRule(this.libraryPreloadedFilesMustExist)
                                .addRule(this.libraryLanguageFilesMustBeValid)
                                .validate(filenames, pathPrefix, error)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1 instanceof AggregateH5pError_1["default"]) {
                            // Don't rethrow a ValidationError (and thus abort validation)
                            // as other libraries can still be validated, too. This is fine
                            // as the error values are appended to the ValidationError and
                            // the error will be thrown at some point anyway.
                            return [2 /*return*/, false];
                        }
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PackageValidator;
}());
exports["default"] = PackageValidator;
//# sourceMappingURL=PackageValidator.js.map