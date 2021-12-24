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
var fs_extra_1 = __importDefault(require("fs-extra"));
var get_all_files_1 = require("get-all-files");
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var InstalledLibrary_1 = __importDefault(require("./InstalledLibrary"));
var LibraryName_1 = __importDefault(require("./LibraryName"));
var TranslatorWithFallback_1 = __importDefault(require("./helpers/TranslatorWithFallback"));
var SimpleLockProvider_1 = __importDefault(require("./implementation/SimpleLockProvider"));
var log = new Logger_1["default"]('LibraryManager');
/**
 * This class manages library installations, enumerating installed libraries etc.
 * It is storage agnostic and can be re-used in all implementations/plugins.
 */
var LibraryManager = /** @class */ (function () {
    /**
     *
     * @param libraryStorage the library repository that persists library
     * somewhere.
     * @param fileUrlResolver gets URLs at which a file in a library can be
     * downloaded. Must be passed through from the implementation.
     * @param alterLibrarySemantics a hook that allows implementations to change
     * the semantics of certain libraries; should be used together with
     * alterLibraryLanguageFile if you plan to use any other language than
     * English! See the documentation of IH5PEditorOptions for more details.
     * @param alterLibraryLanguageFile a hook that allows implementations to
     * change the language files of certain libraries; should be used together
     * with alterLibrarySemantics if you plan to use any other language than
     * English! See the documentation of IH5PEditorOptions for more details.
     * @param translationFunction (optional) The translation function to use if
     * you want to localize library metadata (titles). If undefined, no
     * localization will be performed.
     * @param lock (optional) an implementation of a locking mechanism that
     * prevents race conditions. If this is left undefined a simple
     * single-process lock mechanism will be used. If the library is used within
     * a multi-process or cluster setup, it is necessary to pass in a
     * distributed locking implementation.
     */
    function LibraryManager(libraryStorage, fileUrlResolver, // default is there to avoid having to pass empty function in tests
    alterLibrarySemantics, alterLibraryLanguageFile, translationFunction, lockProvider, config) {
        if (fileUrlResolver === void 0) { fileUrlResolver = function (library, filename) { return ''; }; }
        this.libraryStorage = libraryStorage;
        this.fileUrlResolver = fileUrlResolver;
        this.alterLibrarySemantics = alterLibrarySemantics;
        this.alterLibraryLanguageFile = alterLibraryLanguageFile;
        this.config = config;
        log.info('initialize');
        if (translationFunction) {
            this.translator = new TranslatorWithFallback_1["default"](translationFunction, [
                'hub',
                'library-metadata'
            ]);
        }
        if (!lockProvider) {
            this.lock = new SimpleLockProvider_1["default"]();
        }
        else {
            this.lock = lockProvider;
        }
        if (!this.config) {
            this.config = {
                installLibraryLockMaxOccupationTime: 10000,
                installLibraryLockTimeout: 20000
            };
        }
    }
    /**
     * Returns a readable stream of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param library library
     * @param filename the relative path inside the library
     * @returns a readable stream of the file's contents
     */
    LibraryManager.prototype.getFileStats = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.debug("getting stats ".concat(file, " from library ").concat(LibraryName_1["default"].toUberName(library)));
                return [2 /*return*/, this.libraryStorage.getFileStats(library, file)];
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
    LibraryManager.prototype.getFileStream = function (library, file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.debug("getting file ".concat(file, " from library ").concat(LibraryName_1["default"].toUberName(library)));
                return [2 /*return*/, this.libraryStorage.getFileStream(library, file)];
            });
        });
    };
    /**
     * Gets the language file for the specified language.
     * @param library
     * @param language the language code
     * @returns a string with the contents language file; null if the library
     * isn't localized to the language
     */
    LibraryManager.prototype.getLanguage = function (library, language) {
        return __awaiter(this, void 0, void 0, function () {
            var languageFileAsString, ignored_1, languageCodeMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        log.debug("loading language ".concat(language, " for library ").concat(LibraryName_1["default"].toUberName(library)));
                        return [4 /*yield*/, this.libraryStorage.getFileAsString(library, "language/".concat(language, ".json"))];
                    case 1:
                        languageFileAsString = _a.sent();
                        // If the implementation has specified one, we use a hook to alter
                        // the language files to match the structure of the altered
                        // semantics.
                        if (this.alterLibraryLanguageFile) {
                            log.debug('Calling hook to alter language file of library.');
                            return [2 /*return*/, JSON.stringify({
                                    semantics: this.alterLibraryLanguageFile(library, JSON.parse(languageFileAsString).semantics, language)
                                })];
                        }
                        return [2 /*return*/, languageFileAsString];
                    case 2:
                        ignored_1 = _a.sent();
                        log.debug("language '".concat(language, "' not found for ").concat(LibraryName_1["default"].toUberName(library)));
                        languageCodeMatch = /^([a-zA-Z]+)-([a-zA-Z]+)$/.exec(language);
                        if (languageCodeMatch && languageCodeMatch.length === 3) {
                            log.debug("Language code ".concat(language, " seems to contain country code. Trying without it."));
                            return [2 /*return*/, this.getLanguage(library, languageCodeMatch[1])];
                        }
                        if (language !== 'en' && language !== '.en') {
                            return [2 /*return*/, this.getLanguage(library, 'en')];
                        }
                        if (language === 'en') {
                            return [2 /*return*/, this.getLanguage(library, '.en')];
                        }
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the information about the library that is contained in
     * library.json.
     * @param library The library to get (machineName, majorVersion and
     * minorVersion is enough)
     * @param language (optional) the language to use for the title, will always
     * fall back to English if it is not possible to localize
     * @returns the decoded JSON data or undefined if library is not installed
     */
    LibraryManager.prototype.getLibrary = function (library, language) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        log.debug("loading library ".concat(LibraryName_1["default"].toUberName(library), ". Requested language: ").concat(language));
                        return [4 /*yield*/, this.libraryStorage.getLibrary(library)];
                    case 1:
                        metadata = _b.sent();
                        if (this.translator &&
                            language &&
                            language.toLowerCase() !== 'en' &&
                            !language.toLowerCase().startsWith('en-')) {
                            log.debug("Trying to localize title");
                            metadata.title = this.translator.tryLocalize("".concat(metadata.machineName.replace('.', '_'), ".title"), metadata.title, language);
                        }
                        return [2 /*return*/, metadata];
                    case 2:
                        _a = _b.sent();
                        log.warn("library ".concat(LibraryName_1["default"].toUberName(library), " is not installed"));
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns a (relative) URL for a library file that can be used to hard-code
     * URLs of specific files if necessary. Avoid using this method when
     * possible! This method does NOT check if the file exists!
     * @param library the library for which the URL should be retrieved
     * @param file the filename inside the library (path)
     * @returns the URL of the file
     */
    LibraryManager.prototype.getLibraryFileUrl = function (library, file) {
        log.debug("getting URL of file ".concat(file, " for library ").concat(library.machineName, "-").concat(library.majorVersion, ".").concat(library.minorVersion));
        var url = this.fileUrlResolver(library, file);
        log.debug("URL resolved to ".concat(url));
        return url;
    };
    /**
     * Checks which libraries in the list are not installed.
     * @param libraries the list of libraries to check
     * @returns the list of not installed libraries
     */
    LibraryManager.prototype.getNotInstalledLibraries = function (libraries) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var allLibraries, missingLibraries, _loop_1, _i, libraries_1, lib;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.listInstalledLibraries()];
                    case 1:
                        allLibraries = _b.sent();
                        missingLibraries = [];
                        _loop_1 = function (lib) {
                            if (!((_a = allLibraries[lib.machineName]) === null || _a === void 0 ? void 0 : _a.find(function (l) { return l.compareVersions(lib) === 0; }))) {
                                missingLibraries.push(lib);
                            }
                        };
                        for (_i = 0, libraries_1 = libraries; _i < libraries_1.length; _i++) {
                            lib = libraries_1[_i];
                            _loop_1(lib);
                        }
                        return [2 /*return*/, missingLibraries];
                }
            });
        });
    };
    /**
     * Returns the content of semantics.json for the specified library.
     * @param library
     * @returns the content of semantics.json
     */
    LibraryManager.prototype.getSemantics = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var originalSemantics, alteredSemantics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("loading semantics for library ".concat(LibraryName_1["default"].toUberName(library)));
                        return [4 /*yield*/, this.libraryStorage.getFileAsJson(library, 'semantics.json')];
                    case 1:
                        originalSemantics = _a.sent();
                        if (!this.alterLibrarySemantics) return [3 /*break*/, 3];
                        log.debug('Calling alterLibrarySemantics hook');
                        return [4 /*yield*/, this.alterLibrarySemantics(library, originalSemantics)];
                    case 2:
                        alteredSemantics = _a.sent();
                        if (!alteredSemantics) {
                            throw new Error('alterLibrarySemantics returned undefined, but must return a proper list of semantic entries');
                        }
                        return [2 /*return*/, alteredSemantics];
                    case 3: return [2 /*return*/, originalSemantics];
                }
            });
        });
    };
    /**
     * Returns a URL of the upgrades script in the library
     * @param library the library whose upgrade script should be accessed
     * @returns the URL of upgrades.js. Null if there is no upgrades file.
     * (The null value can be passed back to the client.)
     */
    LibraryManager.prototype.getUpgradesScriptPath = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("getting upgrades script for ".concat(library.machineName, "-").concat(library.majorVersion, ".").concat(library.minorVersion));
                        return [4 /*yield*/, this.libraryStorage.fileExists(library, 'upgrades.js')];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.getLibraryFileUrl(library, 'upgrades.js')];
                        }
                        log.debug("no upgrades script found.");
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Installs or updates a library from a temporary directory. It does not
     * delete the library files in the temporary directory. The method does NOT
     * validate the library! It must be validated before calling this method!
     * Throws an error if something went wrong and deletes the files already
     * installed.
     * @param directory The path to the temporary directory that contains the
     * library files (the root directory that includes library.json)
     * @returns a structure telling if a library was newly installed, updated or
     * nothing happened (e.g. because there already is a newer patch version
     * installed).
     */
    LibraryManager.prototype.installFromDirectory = function (directory, restricted) {
        if (restricted === void 0) { restricted = false; }
        return __awaiter(this, void 0, void 0, function () {
            var newLibraryMetadata, newVersion, error_1, ubername;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("installing from directory ".concat(directory));
                        return [4 /*yield*/, fs_extra_1["default"].readJSON("".concat(directory, "/library.json"))];
                    case 1:
                        newLibraryMetadata = _a.sent();
                        newVersion = {
                            machineName: newLibraryMetadata.machineName,
                            majorVersion: newLibraryMetadata.majorVersion,
                            minorVersion: newLibraryMetadata.minorVersion,
                            patchVersion: newLibraryMetadata.patchVersion
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.lock.acquire("install-from-directory:".concat(LibraryName_1["default"].toUberName(newVersion)), function () { return __awaiter(_this, void 0, void 0, function () {
                                var oldVersion;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.libraryExists(newLibraryMetadata)];
                                        case 1:
                                            if (!_a.sent()) return [3 /*break*/, 5];
                                            oldVersion = void 0;
                                            return [4 /*yield*/, this.isPatchedLibrary(newLibraryMetadata)];
                                        case 2:
                                            if (!
                                            // eslint-disable-next-line no-cond-assign
                                            (oldVersion = _a.sent())) 
                                            // eslint-disable-next-line no-cond-assign
                                            return [3 /*break*/, 4];
                                            // Update the library if it is only a patch of an existing library
                                            return [4 /*yield*/, this.updateLibrary(newLibraryMetadata, directory)];
                                        case 3:
                                            // Update the library if it is only a patch of an existing library
                                            _a.sent();
                                            return [2 /*return*/, {
                                                    newVersion: newVersion,
                                                    oldVersion: oldVersion,
                                                    type: 'patch'
                                                }];
                                        case 4: 
                                        // Skip installation of library if it has already been installed and
                                        // the library is no patch for it.
                                        return [2 /*return*/, { type: 'none' }];
                                        case 5: 
                                        // Install the library if it hasn't been installed before (treat
                                        // different major/minor versions the same as a new library)
                                        return [4 /*yield*/, this.installLibrary(directory, newLibraryMetadata, restricted)];
                                        case 6:
                                            // Install the library if it hasn't been installed before (treat
                                            // different major/minor versions the same as a new library)
                                            _a.sent();
                                            return [2 /*return*/, {
                                                    newVersion: newVersion,
                                                    type: 'new'
                                                }];
                                    }
                                });
                            }); }, {
                                timeout: this.config.installLibraryLockTimeout,
                                maxOccupationTime: this.config.installLibraryLockMaxOccupationTime
                            })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        ubername = LibraryName_1["default"].toUberName(newLibraryMetadata);
                        if (error_1.message == 'occupation-time-exceeded') {
                            log.error("The installation of the library ".concat(ubername, " took longer than the allowed ").concat(this.config.installLibraryLockMaxOccupationTime, " ms."));
                            throw new H5pError_1["default"]('server:install-library-lock-max-time-exceeded', {
                                ubername: ubername,
                                limit: this.config.installLibraryLockTimeout.toString()
                            }, 500);
                        }
                        if (error_1.message == 'timeout') {
                            log.error("Could not acquire installation lock for library ".concat(ubername, " within the limit of ").concat(this.config.installLibraryLockTimeout, " ms."));
                            throw new H5pError_1["default"]('server:install-library-lock-timeout', {
                                ubername: ubername,
                                limit: this.config.installLibraryLockTimeout.toString()
                            }, 500);
                        }
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Is the library a patched version of an existing library?
     * @param library The library the check
     * @returns the full library name of the already installed version if there
     * is a patched version of an existing library, undefined otherwise
     */
    LibraryManager.prototype.isPatchedLibrary = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var wrappedLibraryInfos, libraryInfos, _i, libraryInfos_1, lib;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("checking if library ".concat(LibraryName_1["default"].toUberName(library), " is patched"));
                        return [4 /*yield*/, this.listInstalledLibraries(library.machineName)];
                    case 1:
                        wrappedLibraryInfos = _a.sent();
                        if (!wrappedLibraryInfos || !wrappedLibraryInfos[library.machineName]) {
                            return [2 /*return*/, undefined];
                        }
                        libraryInfos = wrappedLibraryInfos[library.machineName];
                        for (_i = 0, libraryInfos_1 = libraryInfos; _i < libraryInfos_1.length; _i++) {
                            lib = libraryInfos_1[_i];
                            if (lib.majorVersion === library.majorVersion &&
                                lib.minorVersion === library.minorVersion) {
                                if (lib.patchVersion < library.patchVersion) {
                                    return [2 /*return*/, {
                                            machineName: lib.machineName,
                                            majorVersion: lib.majorVersion,
                                            minorVersion: lib.minorVersion,
                                            patchVersion: lib.patchVersion
                                        }];
                                }
                                break;
                            }
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     * Checks if a library was installed.
     * @param library the library to check
     * @returns true if the library has been installed
     */
    LibraryManager.prototype.libraryExists = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.libraryStorage.isInstalled(library)];
            });
        });
    };
    /**
     * Check if the library contains a file
     * @param library The library to check
     * @param filename
     * @return {Promise<boolean>} true if file exists in library, false
     * otherwise
     */
    LibraryManager.prototype.libraryFileExists = function (library, filename) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.debug("checking if file ".concat(filename, " exists for library ").concat(LibraryName_1["default"].toUberName(library)));
                return [2 /*return*/, this.libraryStorage.fileExists(library, filename)];
            });
        });
    };
    /**
     * Checks if the given library has a higher version than the highest
     * installed version.
     * @param library Library to compare against the highest locally installed
     * version.
     * @returns true if the passed library contains a version that is higher
     * than the highest installed version, false otherwise
     */
    LibraryManager.prototype.libraryHasUpgrade = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var wrappedLibraryInfos, allInstalledLibsOfMachineName, highestLocalLibVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.verbose("checking if library ".concat(library.machineName, "-").concat(library.majorVersion, ".").concat(library.minorVersion, " has an upgrade"));
                        return [4 /*yield*/, this.listInstalledLibraries(library.machineName)];
                    case 1:
                        wrappedLibraryInfos = _a.sent();
                        if (!wrappedLibraryInfos || !wrappedLibraryInfos[library.machineName]) {
                            return [2 /*return*/, false];
                        }
                        allInstalledLibsOfMachineName = wrappedLibraryInfos[library.machineName].sort(function (a, b) { return a.compareVersions(b); });
                        highestLocalLibVersion = allInstalledLibsOfMachineName[allInstalledLibsOfMachineName.length - 1];
                        if (highestLocalLibVersion.compareVersions(library) < 0) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    LibraryManager.prototype.listAddons = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.libraryStorage.listAddons) {
                    return [2 /*return*/, this.libraryStorage.listAddons()];
                }
                return [2 /*return*/, []];
            });
        });
    };
    /**
     * Gets a list of files that exist in the library.
     * @param library the library for which the files should be listed
     * @return the files in the library including language files
     */
    LibraryManager.prototype.listFiles = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log.verbose("listing files for library ".concat(LibraryName_1["default"].toUberName(library)));
                return [2 /*return*/, this.libraryStorage.listFiles(library)];
            });
        });
    };
    /**
     * Get a list of the currently installed libraries.
     * @param machineName (optional) only return results for the machine name
     * @returns An object which has properties with the existing library machine
     * names. The properties' values are arrays of Library objects, which
     * represent the different versions installed of this library.
     */
    LibraryManager.prototype.listInstalledLibraries = function (machineName) {
        return __awaiter(this, void 0, void 0, function () {
            var libraries, returnObject, _i, libraries_2, library;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (machineName) {
                            log.debug("Listing libraries with machineName ".concat(machineName));
                        }
                        else {
                            log.debug('Listing all installed libraries.');
                        }
                        return [4 /*yield*/, this.libraryStorage.getInstalledLibraryNames(machineName)];
                    case 1:
                        libraries = _a.sent();
                        return [4 /*yield*/, Promise.all(libraries.map(function (libName) { return __awaiter(_this, void 0, void 0, function () {
                                var installedLib, info;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            installedLib = InstalledLibrary_1["default"].fromName(libName);
                                            return [4 /*yield*/, this.getLibrary(libName)];
                                        case 1:
                                            info = _a.sent();
                                            installedLib.patchVersion = info.patchVersion;
                                            installedLib.runnable = info.runnable;
                                            installedLib.title = info.title;
                                            return [2 /*return*/, installedLib];
                                    }
                                });
                            }); }))];
                    case 2:
                        libraries = (_a.sent()).sort(function (lib1, lib2) { return lib1.compareVersions(lib2); });
                        returnObject = {};
                        for (_i = 0, libraries_2 = libraries; _i < libraries_2.length; _i++) {
                            library = libraries_2[_i];
                            if (!returnObject[library.machineName]) {
                                returnObject[library.machineName] = [];
                            }
                            returnObject[library.machineName].push(library);
                        }
                        return [2 /*return*/, returnObject];
                }
            });
        });
    };
    /**
     * Gets a list of translations that exist for this library.
     * @param library
     * @returns the language codes for translations of this library
     */
    LibraryManager.prototype.listLanguages = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var installedLanguages, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        log.verbose("listing languages for library ".concat(LibraryName_1["default"].toUberName(library)));
                        return [4 /*yield*/, this.libraryStorage.getLanguages(library)];
                    case 1:
                        installedLanguages = _a.sent();
                        // always include English as its the language of the semantics file
                        if (!installedLanguages.includes('en')) {
                            installedLanguages.push('en');
                        }
                        return [2 /*return*/, installedLanguages];
                    case 2:
                        error_2 = _a.sent();
                        log.warn("no languages found for library ".concat(LibraryName_1["default"].toUberName(library)));
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks (as far as possible) if all necessary files are present for the
     * library to run properly.
     * @param library The library to check
     * @returns true if the library is ok. Throws errors if not.
     */
    LibraryManager.prototype.checkConsistency = function (library) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryExists(library)];
                    case 1:
                        if (!(_a.sent())) {
                            log.error("Error in library ".concat(LibraryName_1["default"].toUberName(library), ": not installed."));
                            throw new H5pError_1["default"]('library-consistency-check-not-installed', {
                                name: LibraryName_1["default"].toUberName(library)
                            });
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.libraryStorage.getLibrary(library)];
                    case 3:
                        metadata = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        throw new H5pError_1["default"]('library-consistency-check-library-json-unreadable', {
                            message: error_3.message,
                            name: LibraryName_1["default"].toUberName(library)
                        });
                    case 5:
                        if (!metadata.preloadedJs) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.checkFiles(library, metadata.preloadedJs.map(function (js) { return js.path; }))];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!metadata.preloadedCss) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.checkFiles(library, metadata.preloadedCss.map(function (css) { return css.path; }))];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Checks if all files in the list are present in the library.
     * @param library The library to check
     * @param requiredFiles The files (relative paths in the library) that must
     * be present
     * @returns true if all dependencies are present. Throws an error if any are
     * missing.
     */
    LibraryManager.prototype.checkFiles = function (library, requiredFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var missingFiles;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("checking files ".concat(requiredFiles.join(', '), " for ").concat(LibraryName_1["default"].toUberName(library)));
                        return [4 /*yield*/, Promise.all(requiredFiles.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = {
                                                path: file
                                            };
                                            return [4 /*yield*/, this.libraryStorage.fileExists(library, file)];
                                        case 1: return [2 /*return*/, (_a.status = _b.sent(),
                                                _a)];
                                    }
                                });
                            }); }))];
                    case 1:
                        missingFiles = (_a.sent())
                            .filter(function (file) { return !file.status; })
                            .map(function (file) { return file.path; });
                        if (missingFiles.length > 0) {
                            throw new H5pError_1["default"]('library-consistency-check-file-missing', {
                                files: missingFiles,
                                name: LibraryName_1["default"].toUberName(library)
                            });
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Copies all library file s from a directory (excludes library.json) to the
     * storage. Throws errors if something went wrong.
     * @param fromDirectory The directory to copy from
     * @param libraryInfo the library object
     * @returns
     */
    LibraryManager.prototype.copyLibraryFiles = function (fromDirectory, libraryInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var fromDirectoryLength, files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("copying library files from ".concat(fromDirectory));
                        fromDirectoryLength = fromDirectory.length + 1;
                        return [4 /*yield*/, (0, get_all_files_1.getAllFiles)(fromDirectory).toArray()];
                    case 1:
                        files = _a.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (fileFullPath) {
                                var fileLocalPath = fileFullPath.substr(fromDirectoryLength);
                                if (fileLocalPath === 'library.json') {
                                    return Promise.resolve(true);
                                }
                                var readStream = fs_extra_1["default"].createReadStream(fileFullPath);
                                return _this.libraryStorage.addFile(libraryInfo, fileLocalPath, readStream);
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Installs a library and rolls back changes if the library installation
     * failed. Throws errors if something went wrong.
     * @param fromDirectory the local directory to install from
     * @param libraryInfo the library object
     * @param libraryMetadata the library metadata
     * @param restricted true if the library can only be installed with a
     * special permission
     * @returns the library object (containing - among others - the id of the
     * newly installed library)
     */
    LibraryManager.prototype.installLibrary = function (fromDirectory, libraryMetadata, restricted) {
        return __awaiter(this, void 0, void 0, function () {
            var ubername, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("installing library ".concat(LibraryName_1["default"].toUberName(libraryMetadata), " from ").concat(fromDirectory));
                        ubername = LibraryName_1["default"].toUberName(libraryMetadata);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.lock.acquire("install-library:".concat(ubername), function () { return __awaiter(_this, void 0, void 0, function () {
                                var newLibraryInfo, error_5;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.libraryStorage.addLibrary(libraryMetadata, restricted)];
                                        case 1:
                                            newLibraryInfo = _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 5, , 7]);
                                            return [4 /*yield*/, this.copyLibraryFiles(fromDirectory, newLibraryInfo)];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, this.checkConsistency(libraryMetadata)];
                                        case 4:
                                            _a.sent();
                                            return [3 /*break*/, 7];
                                        case 5:
                                            error_5 = _a.sent();
                                            log.error("There was a consistency error when installing library ".concat(ubername, ". Reverting installation."));
                                            return [4 /*yield*/, this.libraryStorage.deleteLibrary(libraryMetadata)];
                                        case 6:
                                            _a.sent();
                                            throw error_5;
                                        case 7:
                                            log.debug("library ".concat(LibraryName_1["default"].toUberName(libraryMetadata), " successfully installed."));
                                            return [2 /*return*/, newLibraryInfo];
                                    }
                                });
                            }); }, {
                                timeout: this.config.installLibraryLockTimeout,
                                maxOccupationTime: this.config.installLibraryLockMaxOccupationTime
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        if (error_4.message == 'occupation-time-exceeded') {
                            log.error("The installation of library ".concat(ubername, " took longer than the allowed ").concat(this.config.installLibraryLockMaxOccupationTime, " ms. Deleting the library."));
                            throw new H5pError_1["default"]('server:install-library-lock-max-time-exceeded', {
                                ubername: ubername,
                                limit: this.config.installLibraryLockTimeout.toString()
                            }, 500);
                        }
                        if (error_4.message == 'timeout') {
                            log.error("Could not acquire installation lock for library ".concat(ubername, " within the limit of ").concat(this.config.installLibraryLockTimeout, " ms."));
                            throw new H5pError_1["default"]('server:install-library-lock-timeout', {
                                ubername: ubername,
                                limit: this.config.installLibraryLockTimeout.toString()
                            }, 500);
                        }
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the library to a new version. REMOVES THE LIBRARY IF THERE IS AN
     * ERROR!!!
     * @param filesDirectory the path of the directory containing the library
     * files to update to
     * @param library the library object
     * @param newLibraryMetadata the library metadata (library.json)
     */
    LibraryManager.prototype.updateLibrary = function (newLibraryMetadata, filesDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        log.info("updating library ".concat(LibraryName_1["default"].toUberName(newLibraryMetadata), " in ").concat(filesDirectory));
                        return [4 /*yield*/, this.libraryStorage.updateLibrary(newLibraryMetadata)];
                    case 1:
                        _a.sent();
                        log.info("clearing library ".concat(LibraryName_1["default"].toUberName(newLibraryMetadata), " from files"));
                        return [4 /*yield*/, this.libraryStorage.clearFiles(newLibraryMetadata)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.copyLibraryFiles(filesDirectory, newLibraryMetadata)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.checkConsistency(newLibraryMetadata)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        error_6 = _a.sent();
                        log.error(error_6);
                        log.info("removing library ".concat(LibraryName_1["default"].toUberName(newLibraryMetadata)));
                        return [4 /*yield*/, this.libraryStorage.deleteLibrary(newLibraryMetadata)];
                    case 6:
                        _a.sent();
                        throw error_6;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return LibraryManager;
}());
exports["default"] = LibraryManager;
//# sourceMappingURL=LibraryManager.js.map