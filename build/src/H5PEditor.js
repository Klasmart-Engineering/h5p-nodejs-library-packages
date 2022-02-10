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
exports.__esModule = true;
var tmp_promise_1 = require("tmp-promise");
var stream_1 = require("stream");
var ajv_1 = __importDefault(require("ajv"));
var ajv_keywords_1 = __importDefault(require("ajv-keywords"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var image_size_1 = __importDefault(require("image-size"));
var mime_types_1 = __importDefault(require("mime-types"));
var path_1 = __importDefault(require("path"));
var promisepipe_1 = __importDefault(require("promisepipe"));
var defaultClientStrings_json_1 = __importDefault(require("../assets/defaultClientStrings.json"));
var defaultCopyrightSemantics_json_1 = __importDefault(require("../assets/defaultCopyrightSemantics.json"));
var defaultMetadataSemantics_json_1 = __importDefault(require("../assets/defaultMetadataSemantics.json"));
var en_json_1 = __importDefault(require("../assets/translations/client/en.json"));
var en_json_2 = __importDefault(require("../assets/translations/copyright-semantics/en.json"));
var en_json_3 = __importDefault(require("../assets/translations/metadata-semantics/en.json"));
var editorAssetList_json_1 = __importDefault(require("./editorAssetList.json"));
var default_1 = __importDefault(require("./renderers/default"));
var editorLanguages_json_1 = __importDefault(require("../assets/editorLanguages.json"));
var ContentManager_1 = __importDefault(require("./ContentManager"));
var ContentMetadata_1 = require("./ContentMetadata");
var ContentStorer_1 = __importDefault(require("./ContentStorer"));
var ContentTypeCache_1 = __importDefault(require("./ContentTypeCache"));
var ContentTypeInformationRepository_1 = __importDefault(require("./ContentTypeInformationRepository"));
var H5pError_1 = __importDefault(require("./helpers/H5pError"));
var Logger_1 = __importDefault(require("./helpers/Logger"));
var LibraryManager_1 = __importDefault(require("./LibraryManager"));
var LibraryName_1 = __importDefault(require("./LibraryName"));
var PackageExporter_1 = __importDefault(require("./PackageExporter"));
var PackageImporter_1 = __importDefault(require("./PackageImporter"));
var TemporaryFileManager_1 = __importDefault(require("./TemporaryFileManager"));
var UrlGenerator_1 = __importDefault(require("./UrlGenerator"));
var SemanticsLocalizer_1 = __importDefault(require("./SemanticsLocalizer"));
var SimpleTranslator_1 = __importDefault(require("./helpers/SimpleTranslator"));
var DependencyGetter_1 = __importDefault(require("./DependencyGetter"));
var ContentHub_1 = __importDefault(require("./ContentHub"));
var downloadFile_1 = require("./helpers/downloadFile");
var log = new Logger_1["default"]('H5PEditor');
var H5PEditor = /** @class */ (function () {
    /**
     * @param cache the cache is used to store key - value pairs that must be
     * accessed often; values stored in it must be accessible by ALL instances
     * of the editor (across machines)
     * @param config the configuration values for the editor; note that the
     * editor can also change these values and save them!
     * @param libraryStorage the storage object for libraries
     * @param contentStorage the storage object for content
     * @param temporaryStorage the storage object for temporary files
     * @param translationCallback a function that is called to retrieve
     * translations of keys in a certain language; the keys use the i18next
     * format (e.g. namespace:key). See the ITranslationFunction documentation
     * for more details.
     * @param urlGenerator creates url strings for files, can be used to
     * customize the paths in an implementation application
     * @param options more options to customize the behavior of the editor; see
     * IH5PEditorOptions documentation for more details
     */
    function H5PEditor(cache, config, libraryStorage, contentStorage, temporaryStorage, translationCallback, urlGenerator, options) {
        var _this = this;
        if (translationCallback === void 0) { translationCallback = new SimpleTranslator_1["default"]({
            // We use a simplistic translation function that is hard-wired to
            // English if the implementation does not pass us a proper one.
            client: en_json_1["default"],
            'metadata-semantics': en_json_3["default"],
            'copyright-semantics': en_json_2["default"]
        }).t; }
        if (urlGenerator === void 0) { urlGenerator = new UrlGenerator_1["default"](config); }
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        this.cache = cache;
        this.config = config;
        this.libraryStorage = libraryStorage;
        this.contentStorage = contentStorage;
        this.temporaryStorage = temporaryStorage;
        this.urlGenerator = urlGenerator;
        this.options = options;
        this.copyrightSemantics = defaultCopyrightSemantics_json_1["default"];
        this.globalCustomScripts = [];
        this.globalCustomStyles = [];
        this.metadataSemantics = defaultMetadataSemantics_json_1["default"];
        /**
         * Generates cache buster strings that are used by the JavaScript client in
         * the browser when generating URLs of core JavaScript files (only rarely
         * used).
         *
         * If you want to customize cache busting, you can override this generator.
         * The default generator creates strings like '?version=1.24.0', which are
         * simply added to the URL.
         */
        this.cacheBusterGenerator = function () {
            return "?version=".concat(_this.config.h5pVersion);
        };
        log.info('initialize');
        this.config = config;
        this.renderer = default_1["default"];
        this.contentTypeCache = new ContentTypeCache_1["default"](config, cache);
        this.contentHub = new ContentHub_1["default"](config, cache);
        this.libraryManager = new LibraryManager_1["default"](libraryStorage, this.urlGenerator.libraryFile, (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.customization) === null || _b === void 0 ? void 0 : _b.alterLibrarySemantics, (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.customization) === null || _d === void 0 ? void 0 : _d.alterLibraryLanguageFile, ((_e = this.options) === null || _e === void 0 ? void 0 : _e.enableLibraryNameLocalization)
            ? translationCallback
            : undefined, (_f = this.options) === null || _f === void 0 ? void 0 : _f.lockProvider, this.config);
        this.contentManager = new ContentManager_1["default"](contentStorage);
        this.contentTypeRepository = new ContentTypeInformationRepository_1["default"](this.contentTypeCache, this.libraryManager, config, (options === null || options === void 0 ? void 0 : options.enableHubLocalization) ? translationCallback : undefined);
        this.temporaryFileManager = new TemporaryFileManager_1["default"](temporaryStorage, this.config);
        this.contentStorer = new ContentStorer_1["default"](this.contentManager, this.libraryManager, this.temporaryFileManager);
        this.packageImporter = new PackageImporter_1["default"](this.libraryManager, this.config, this.contentManager, this.contentStorer);
        this.packageExporter = new PackageExporter_1["default"](this.libraryManager, this.contentStorage, config);
        this.semanticsLocalizer = new SemanticsLocalizer_1["default"](translationCallback);
        this.dependencyGetter = new DependencyGetter_1["default"](libraryStorage);
        this.globalCustomScripts =
            ((_j = (_h = (_g = this.options) === null || _g === void 0 ? void 0 : _g.customization) === null || _h === void 0 ? void 0 : _h.global) === null || _j === void 0 ? void 0 : _j.scripts) || [];
        if ((_m = (_l = (_k = this.config.customization) === null || _k === void 0 ? void 0 : _k.global) === null || _l === void 0 ? void 0 : _l.editor) === null || _m === void 0 ? void 0 : _m.scripts) {
            this.globalCustomScripts = this.globalCustomScripts.concat((_o = this.config.customization.global) === null || _o === void 0 ? void 0 : _o.editor.scripts);
        }
        this.globalCustomStyles =
            ((_r = (_q = (_p = this.options) === null || _p === void 0 ? void 0 : _p.customization) === null || _q === void 0 ? void 0 : _q.global) === null || _r === void 0 ? void 0 : _r.styles) || [];
        if ((_u = (_t = (_s = this.config.customization) === null || _s === void 0 ? void 0 : _s.global) === null || _t === void 0 ? void 0 : _t.editor) === null || _u === void 0 ? void 0 : _u.styles) {
            this.globalCustomStyles = this.globalCustomStyles.concat((_v = this.config.customization.global) === null || _v === void 0 ? void 0 : _v.editor.styles);
        }
        var jsonValidator = new ajv_1["default"]();
        (0, ajv_keywords_1["default"])(jsonValidator, 'regexp');
        var saveMetadataJsonSchema = fs_extra_1["default"].readJSONSync(path_1["default"].join(__dirname, 'schemas/save-metadata.json'));
        var libraryNameSchema = fs_extra_1["default"].readJSONSync(path_1["default"].join(__dirname, 'schemas/library-name-schema.json'));
        jsonValidator.addSchema([saveMetadataJsonSchema, libraryNameSchema]);
        this.contentMetadataValidator = jsonValidator.compile(saveMetadataJsonSchema);
    }
    /**
     * Deletes a piece of content and all files dependent on it.
     * @param contentId the piece of content to delete
     * @param user the user who wants to delete it
     */
    H5PEditor.prototype.deleteContent = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contentManager.deleteContent(contentId, user)];
            });
        });
    };
    /**
     * Creates a .h5p-package for the specified content file and pipes it to the
     * stream. Throws H5pErrors if something goes wrong. The contents of the
     * stream should be disregarded then.
     *
     * IMPORTANT: This method's returned promise will resolve BEFORE piping to
     * the writeable has been finished. If you outputStream is directly piped to
     * a download that's not an issue, but if you do something else with this
     * stream, you have to wait for the piping to finish by subscribing to the
     * 'finish' event of the stream!
     *
     * @param contentId The contentId for which the package should be created.
     * @param outputWritable The writable that the package is written to (e.g.
     * the response stream fo Express)
     */
    H5PEditor.prototype.exportContent = function (contentId, outputWritable, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.packageExporter.createPackage(contentId, outputWritable, user)];
            });
        });
    };
    /**
     * Returns all the data needed to editor or display content
     * @param contentId the content id
     * @param user (optional) the user who wants to access the content; if undefined, access will be granted
     * @returns all relevant information for the content (you can send it back to the GET request for content)
     */
    H5PEditor.prototype.getContent = function (contentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, h5pJson, content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("loading h5p for ".concat(contentId));
                        return [4 /*yield*/, Promise.all([
                                this.contentManager.getContentMetadata(contentId, user),
                                this.contentManager.getContentParameters(contentId, user)
                            ])];
                    case 1:
                        _a = _b.sent(), h5pJson = _a[0], content = _a[1];
                        return [2 /*return*/, {
                                h5p: h5pJson,
                                library: ContentMetadata_1.ContentMetadata.toUbername(h5pJson),
                                params: {
                                    metadata: h5pJson,
                                    params: content
                                }
                            }];
                }
            });
        });
    };
    /**
     * Returns a readable for a file that was uploaded for a content object.
     * The requested content file can be a temporary file uploaded for unsaved content or a
     * file in permanent content storage.
     * @param contentId the content id (undefined if retrieved for unsaved content)
     * @param filename the file to get (without 'content/' prefix!)
     * @param user the user who wants to retrieve the file
     * @param rangeStart (optional) the position in bytes at which the stream should start
     * @param rangeEnd (optional) the position in bytes at which the stream should end
     * @returns a readable of the content file
     */
    H5PEditor.prototype.getContentFileStream = function (contentId, filename, user, rangeStart, rangeEnd) {
        return __awaiter(this, void 0, void 0, function () {
            var returnStream, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!contentId) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.contentManager.getContentFileStream(contentId, filename, user, rangeStart, rangeEnd)];
                    case 2:
                        returnStream = _a.sent();
                        return [2 /*return*/, returnStream];
                    case 3:
                        error_1 = _a.sent();
                        log.debug("Couldn't find file ".concat(filename, " in storage. Trying temporary storage."));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, this.temporaryFileManager.getFileStream(filename, user, rangeStart, rangeEnd)];
                }
            });
        });
    };
    /**
     * Returns the content type cache for a specific user. This includes all
     * available content types for the user (some might be restricted) and what
     * the user can do with them (update, install from Hub).
     */
    H5PEditor.prototype.getContentTypeCache = function (user, language) {
        log.info("getting content type cache");
        return this.contentTypeRepository.get(user, language);
    };
    /**
     * Returns detailed information about an installed library.
     */
    H5PEditor.prototype.getLibraryData = function (machineName, majorVersion, minorVersion, language) {
        if (language === void 0) { language = 'en'; }
        return __awaiter(this, void 0, void 0, function () {
            var majorVersionAsNr, minorVersionAsNr, library, _a, assets, semantics, languageObject, languages, installedLibrary, upgradeScriptPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("getting data for library ".concat(machineName, "-").concat(majorVersion, ".").concat(minorVersion));
                        majorVersionAsNr = Number.parseInt(majorVersion, 10);
                        minorVersionAsNr = Number.parseInt(minorVersion, 10);
                        library = new LibraryName_1["default"](machineName, majorVersionAsNr, minorVersionAsNr);
                        this.validateLanguageCode(language);
                        return [4 /*yield*/, this.libraryManager.libraryExists(library)];
                    case 1:
                        if (!(_b.sent())) {
                            throw new H5pError_1["default"]('library-not-found', { name: LibraryName_1["default"].toUberName(library) }, 404);
                        }
                        return [4 /*yield*/, Promise.all([
                                this.listAssets(new LibraryName_1["default"](machineName, majorVersionAsNr, minorVersionAsNr), language),
                                this.libraryManager.getSemantics(library),
                                this.libraryManager.getLanguage(library, language),
                                this.libraryManager.listLanguages(library),
                                this.libraryManager.getLibrary(library, language),
                                this.libraryManager.getUpgradesScriptPath(library)
                            ])];
                    case 2:
                        _a = _b.sent(), assets = _a[0], semantics = _a[1], languageObject = _a[2], languages = _a[3], installedLibrary = _a[4], upgradeScriptPath = _a[5];
                        return [2 /*return*/, {
                                languages: languages,
                                semantics: semantics,
                                css: assets.styles,
                                defaultLanguage: null,
                                language: languageObject,
                                name: machineName,
                                version: {
                                    major: majorVersionAsNr,
                                    minor: minorVersionAsNr
                                },
                                javascript: assets.scripts,
                                title: installedLibrary.title,
                                translations: assets.translations,
                                upgradesScript: upgradeScriptPath // we don't check whether the path is null, as we can return null
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
    H5PEditor.prototype.getLibraryFileStream = function (library, filename) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                LibraryName_1["default"].validate(library);
                return [2 /*return*/, this.libraryManager.getFileStream(library, filename)];
            });
        });
    };
    /**
     * Gets a rough overview of information about the requested libraries.
     * @param ubernames
     * @param language (optional) if set, the system will try to localize the
     * title of the library (the namespace 'library-metadata' must be loaded in
     * the i18n system)
     */
    H5PEditor.prototype.getLibraryOverview = function (ubernames, language) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.debug("getting library overview for libraries: ".concat(ubernames.join(', '), ". Requested language: ").concat(language));
                        return [4 /*yield*/, Promise.all(ubernames
                                .map(function (name) {
                                return LibraryName_1["default"].fromUberName(name, {
                                    useWhitespace: true
                                });
                            })
                                .filter(function (lib) { return lib !== undefined; }) // we filter out undefined values as Library.creatFromNames returns undefined for invalid names
                                .map(function (lib) { return __awaiter(_this, void 0, void 0, function () {
                                var loadedLibrary, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.libraryManager.getLibrary(lib, language)];
                                        case 1:
                                            loadedLibrary = _a.sent();
                                            if (!loadedLibrary) {
                                                return [2 /*return*/, undefined];
                                            }
                                            return [2 /*return*/, {
                                                    majorVersion: loadedLibrary.majorVersion,
                                                    metadataSettings: loadedLibrary.metadataSettings || null,
                                                    minorVersion: loadedLibrary.minorVersion,
                                                    name: loadedLibrary.machineName,
                                                    restricted: false,
                                                    runnable: loadedLibrary.runnable,
                                                    title: loadedLibrary.title,
                                                    tutorialUrl: '',
                                                    uberName: "".concat(loadedLibrary.machineName, " ").concat(loadedLibrary.majorVersion, ".").concat(loadedLibrary.minorVersion)
                                                }];
                                        case 2:
                                            error_2 = _a.sent();
                                            // if a library can't be loaded the whole call should still succeed
                                            return [2 /*return*/, undefined];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1: return [2 /*return*/, (_a.sent()).filter(function (lib) { return lib !== undefined; })]; // we filter out undefined values as the last map return undefined values if a library doesn't exist
                }
            });
        });
    };
    /**
     * Installs a content type from the H5P Hub.
     * @param machineName The name of the content type to install (e.g. H5P.Test) Note that this is not a full ubername!
     * @returns a list of installed libraries if successful. Will throw errors if something goes wrong.
     */
    H5PEditor.prototype.installLibraryFromHub = function (machineName, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                LibraryName_1["default"].validateMachineName(machineName);
                return [2 /*return*/, this.contentTypeRepository.installContentType(machineName, user)];
            });
        });
    };
    /**
     * Retrieves the installed languages for libraries
     * @param libraryUbernames A list of libraries for which the language files
     * should be retrieved. In this list the names of the libraries don't use
     * hyphens to separate machine name and version.
     * @param language the language code to get the files for
     * @returns The strings of the language files
     */
    H5PEditor.prototype.listLibraryLanguageFiles = function (libraryUbernames, language) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log.info("getting language files (".concat(language, ") for ").concat(libraryUbernames.join(', ')));
                        this.validateLanguageCode(language);
                        return [4 /*yield*/, Promise.all(libraryUbernames.map(function (name) { return __awaiter(_this, void 0, void 0, function () {
                                var lib;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            lib = LibraryName_1["default"].fromUberName(name, {
                                                useWhitespace: true
                                            });
                                            _a = {};
                                            return [4 /*yield*/, this.libraryManager.getLanguage(lib, language)];
                                        case 1: return [2 /*return*/, (_a.languageString = _b.sent(),
                                                _a.name = name,
                                                _a)];
                                    }
                                });
                            }); }))];
                    case 1: return [2 /*return*/, (_a.sent()).reduce(function (builtObject, _a) {
                            var languageString = _a.languageString, name = _a.name;
                            if (languageString) {
                                builtObject[name] = languageString;
                            }
                            return builtObject;
                        }, {})];
                }
            });
        });
    };
    /**
     * Renders the content. This means that a frame in which the editor is
     * displayed is generated and returned. You can override the default frame
     * by calling setRenderer(...).
     * @param contentId
     * @param language the language to use; defaults to English
     * @param user the user who uses the editor
     * @returns the rendered frame that you can include in your website.
     * Normally a string, but can be anything you want it to be if you override
     * the renderer.
     */
    H5PEditor.prototype.render = function (contentId, language, user) {
        if (language === void 0) { language = 'en'; }
        log.info("rendering ".concat(contentId));
        this.validateLanguageCode(language);
        var model = {
            integration: this.generateIntegration(contentId, language, user),
            scripts: this.listCoreScripts(language),
            styles: this.listCoreStyles(),
            urlGenerator: this.urlGenerator
        };
        return Promise.resolve(this.renderer(model));
    };
    /**
     * Stores an uploaded file in temporary storage.
     * @param contentId the id of the piece of content the file is attached to;
     * Set to null/undefined if the content hasn't been saved before.
     * @param field the semantic structure of the field the file is attached to.
     * @param file information about the uploaded file; either data or
     * tempFilePath must be used!
     * @returns information about the uploaded file
     */
    H5PEditor.prototype.saveContentFile = function (contentId, field, file, user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var imageDimensions, extension, cleanExtension, cleanFilename, dataStream, tmpFilename;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if ((field.type === 'image' && !file.mimetype.startsWith('image/')) ||
                            (field.type === 'video' && !file.mimetype.startsWith('video/')) ||
                            (field.type === 'audio' && !file.mimetype.startsWith('audio/'))) {
                            throw new H5pError_1["default"]('upload-validation-error', {}, 400);
                        }
                        try {
                            if (file.mimetype.startsWith('image/')) {
                                imageDimensions = (0, image_size_1["default"])(((_a = file.data) === null || _a === void 0 ? void 0 : _a.length) > 0 ? file.data : file.tempFilePath);
                            }
                        }
                        catch (error) {
                            // A caught error means that the file format is not supported by
                            // image-size. This usually means that the file is corrupt.
                            log.debug("Invalid image upload: ".concat(error));
                            throw new H5pError_1["default"]('upload-validation-error', {}, 400);
                        }
                        extension = path_1["default"].extname(file.name).toLowerCase();
                        cleanExtension = extension.length > 1 ? extension.substr(1) : '';
                        if (!this.config.contentWhitelist.split(' ').includes(cleanExtension)) {
                            throw new H5pError_1["default"]('not-in-whitelist', {
                                filename: file.name,
                                'files-allowed': this.config.contentWhitelist
                            });
                        }
                        cleanFilename = 
                        // We check if the field type is allowed to protect against
                        // injections
                        (field.type &&
                            [
                                'file',
                                'text',
                                'number',
                                'boolean',
                                'group',
                                'list',
                                'select',
                                'library',
                                'image',
                                'video',
                                'audio'
                            ].includes(field.type)
                            ? field.type
                            : 'file') + extension;
                        // Some PHP implementations of H5P (Moodle) expect the uploaded files to
                        // be in sub-directories of the content folder. To achieve
                        // compatibility, we also put them into these directories by their
                        // mime-types.
                        cleanFilename = this.addDirectoryByMimetype(cleanFilename);
                        if (((_b = file.data) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                            dataStream = new stream_1.PassThrough();
                            dataStream.end(file.data);
                        }
                        else if (file.tempFilePath) {
                            dataStream = fs_extra_1["default"].createReadStream(file.tempFilePath);
                        }
                        else {
                            throw new Error('Either file.data or file.tempFilePath must be used!');
                        }
                        log.info("Putting content file ".concat(cleanFilename, " into temporary storage"));
                        return [4 /*yield*/, this.temporaryFileManager.addFile(cleanFilename, dataStream, user)];
                    case 1:
                        tmpFilename = _c.sent();
                        // We close the stream to make sure the temporary file can be deleted
                        // elsewhere.
                        if (dataStream.close) {
                            dataStream.close();
                        }
                        log.debug("New temporary filename is ".concat(tmpFilename));
                        return [2 /*return*/, {
                                height: imageDimensions === null || imageDimensions === void 0 ? void 0 : imageDimensions.height,
                                mime: file.mimetype,
                                path: "".concat(tmpFilename, "#tmp"),
                                width: imageDimensions === null || imageDimensions === void 0 ? void 0 : imageDimensions.width
                            }];
                }
            });
        });
    };
    /**
     * Stores new content or updates existing content.
     * Copies over files from temporary storage if necessary.
     * @param contentId the contentId of existing content (undefined or previously unsaved content)
     * @param parameters the content parameters (=content.json)
     * @param metadata the content metadata (~h5p.json)
     * @param mainLibraryUbername the ubername with whitespace as separator (no hyphen!)
     * @param user the user who wants to save the piece of content
     * @returns the existing contentId or the newly assigned one
     */
    H5PEditor.prototype.saveOrUpdateContent = function (contentId, parameters, metadata, mainLibraryUbername, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveOrUpdateContentReturnMetaData(contentId, parameters, metadata, mainLibraryUbername, user)];
                    case 1: return [2 /*return*/, (_a.sent()).id];
                }
            });
        });
    };
    H5PEditor.prototype.cloneContent = function (contentId, parameters, metadata, mainLibraryName, user) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedLibraryName, h5pJson, newContentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (contentId !== undefined) {
                            log.info("saving h5p content for ".concat(contentId));
                        }
                        else {
                            log.info('saving new content');
                        }
                        try {
                            parsedLibraryName = LibraryName_1["default"].fromUberName(mainLibraryName, {
                                useWhitespace: true
                            });
                        }
                        catch (error) {
                            throw new H5pError_1["default"]('invalid-main-library-name', { message: error.message }, 400);
                        }
                        return [4 /*yield*/, this.generateContentMetadata(metadata, parsedLibraryName, this.findLibrariesInParameters(parameters))];
                    case 1:
                        h5pJson = _a.sent();
                        return [4 /*yield*/, this.contentStorer.cloneContent(contentId, parameters, h5pJson, parsedLibraryName, user)];
                    case 2:
                        newContentId = _a.sent();
                        return [2 /*return*/, newContentId];
                }
            });
        });
    };
    /**
     * Stores new content or updates existing content.
     * Copies over files from temporary storage if necessary.
     * @param contentId the contentId of existing content (undefined or previously unsaved content)
     * @param parameters the content parameters (=content.json)
     * @param metadata the content metadata (~h5p.json)
     * @param mainLibraryUbername the ubername with whitespace as separator (no hyphen!)
     * @param user the user who wants to save the piece of content
     * @returns the existing contentId or the newly assigned one and the metatdata
     */
    H5PEditor.prototype.saveOrUpdateContentReturnMetaData = function (contentId, parameters, metadata, mainLibraryUbername, user) {
        return __awaiter(this, void 0, void 0, function () {
            var libraryName, h5pJson, newContentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (contentId !== undefined) {
                            log.info("saving h5p content for ".concat(contentId));
                        }
                        else {
                            log.info('saving new content');
                        }
                        try {
                            libraryName = LibraryName_1["default"].fromUberName(mainLibraryUbername, {
                                useWhitespace: true
                            });
                        }
                        catch (error) {
                            throw new H5pError_1["default"]('invalid-main-library-name', { message: error.message }, 400);
                        }
                        // Validate metadata against schema
                        if (!this.contentMetadataValidator(metadata)) {
                            throw new Error('Metadata does not conform to schema.');
                        }
                        return [4 /*yield*/, this.generateContentMetadata(metadata, libraryName, this.findLibrariesInParameters(parameters))];
                    case 1:
                        h5pJson = _a.sent();
                        return [4 /*yield*/, this.contentStorer.addOrUpdateContent(contentId, parameters, h5pJson, libraryName, user)];
                    case 2:
                        newContentId = _a.sent();
                        return [2 /*return*/, { id: newContentId, metadata: h5pJson }];
                }
            });
        });
    };
    /**
     * By setting custom copyright semantics, you can customize what licenses
     * are displayed when editing metadata of files.
     *
     * NOTE: It is unclear if copyrightSemantics is deprecated in the H5P
     * client. Use setMetadataSemantics instead, which certainly works.
     *
     * NOTE: The semantic structure is localized before delivered to the H5P
     * client. If you change it, you must either make sure there is a appropriate
     * language file loaded in your translation library (and set one in the
     * first place).
     * @param copyrightSemantics a semantic structure similar to the one used in
     * semantics.json of regular H5P libraries. See https://h5p.org/semantics
     * for more documentation. However, you can only add one entry (which can
     * be nested). See the file assets/defaultCopyrightSemantics.json for the
     * default version which you can build on.
     * @returns the H5PEditor object that you can use to chain method calls
     */
    H5PEditor.prototype.setCopyrightSemantics = function (copyrightSemantics) {
        this.copyrightSemantics = copyrightSemantics;
        return this;
    };
    /**
     * By setting custom metadata semantics, you can customize what licenses are
     * displayed when editing metadata of content object and files.
     *
     * NOTE: It is only trivial to change the license offered as a a selection
     * to the editors. All other semantic entries CANNOT be changed, as the
     * form displayed in the editor is hard-coded in h5peditor-metadata.js in
     * the client. You'll have to replace this file with a custom implementation
     * if you want to change more metadata.
     *
     * NOTE: The semantic structure is localized before delivered to the H5P
     * client. If you change it, you must either make sure there is a appropriate
     * language file loaded in your translation library (and set one in the
     * first place).
     * @param metadataSemantics a semantic structure similar to the one used in
     * semantics.json of regular H5P libraries. See https://h5p.org/semantics
     * for more documentation. See the file assets/defaultMetadataSemantics.json
     * for the default version which you can build on
     * @returns the H5PEditor object that you can use to chain method calls
     */
    H5PEditor.prototype.setMetadataSemantics = function (metadataSemantics) {
        this.metadataSemantics = metadataSemantics;
        return this;
    };
    /**
     * By setting a custom renderer you can change the way the editor produces
     * HTML output
     * @param renderer
     * @returns the H5PEditor object that you can use to chain method calls
     */
    H5PEditor.prototype.setRenderer = function (renderer) {
        this.renderer = renderer;
        return this;
    };
    /**
     * Adds the contents of a package to the system: Installs required libraries
     * (if the user has the permissions for this), adds files to temporary
     * storage and returns the actual content information for the editor to
     * process. Throws errors if something goes wrong.
     * @param dataOrPath the raw data of the h5p package as a buffer or the path
     * of the file in the local filesystem
     * @param user the user who is uploading the package; optional if
     * onlyInstallLibraries is set to true
     * @param options (optional) further options:
     * @param onlyInstallLibraries true if content should be disregarded
     * @returns the content information extracted from the package. The metadata
     * and parameters property will be undefined if onlyInstallLibraries was set
     * to true.
     */
    H5PEditor.prototype.uploadPackage = function (dataOrPath, user, options) {
        return __awaiter(this, void 0, void 0, function () {
            var returnValues, filename, tempFile, dataStream, writeStream, error_3, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log.info("uploading package");
                        if (!(typeof dataOrPath !== 'string')) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, tmp_promise_1.file)({ postfix: '.h5p', keep: false })];
                    case 1:
                        tempFile = _b.sent();
                        filename = tempFile.path;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, , 10]);
                        dataStream = new stream_1.PassThrough();
                        dataStream.end(dataOrPath);
                        writeStream = fs_extra_1["default"].createWriteStream(filename);
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, (0, promisepipe_1["default"])(dataStream, writeStream)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _b.sent();
                        throw new H5pError_1["default"]('upload-package-failed-tmp');
                    case 6: return [3 /*break*/, 10];
                    case 7:
                        error_4 = _b.sent();
                        if (!tempFile) return [3 /*break*/, 9];
                        return [4 /*yield*/, tempFile.cleanup()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: throw error_4;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        filename = dataOrPath;
                        _b.label = 12;
                    case 12:
                        _b.trys.push([12, , 17, 20]);
                        if (!(options === null || options === void 0 ? void 0 : options.onlyInstallLibraries)) return [3 /*break*/, 14];
                        _a = {};
                        return [4 /*yield*/, this.packageImporter.installLibrariesFromPackage(filename)];
                    case 13:
                        returnValues = (_a.installedLibraries = _b.sent(),
                            _a);
                        return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, this.packageImporter.addPackageLibrariesAndTemporaryFiles(filename, user)];
                    case 15:
                        returnValues =
                            _b.sent();
                        _b.label = 16;
                    case 16: return [3 /*break*/, 20];
                    case 17:
                        if (!tempFile) return [3 /*break*/, 19];
                        return [4 /*yield*/, tempFile.cleanup()];
                    case 18:
                        _b.sent();
                        _b.label = 19;
                    case 19: return [7 /*endfinally*/];
                    case 20: return [2 /*return*/, returnValues];
                }
            });
        });
    };
    /**
     * Downloads a .h5p file from the content hub. Then "uploads" the file as if
     * the user uploaded the file manually.
     * @param contentHubId the content hub id; this is a id of the external
     * service and not related to local contentId
     * @param user the user who is using the content hub; relevant for temporary
     * file access rights
     * @returns the content information extracted from the package.
     */
    H5PEditor.prototype.getContentHubContent = function (contentHubId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                log.debug("Getting content hub content with id ".concat(contentHubId, "."));
                return [2 /*return*/, (0, tmp_promise_1.withFile)(function (_a) {
                        var tmpFile = _a.path;
                        return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, downloadFile_1.downloadFile)("".concat(this.config.contentHubContentEndpoint, "/").concat(contentHubId, "/export"), tmpFile, this.config)];
                                    case 1:
                                        _b.sent();
                                        log.debug("Hub content downloaded to ".concat(tmpFile));
                                        return [2 /*return*/, this.uploadPackage(tmpFile, user)];
                                }
                            });
                        });
                    }, {
                        postfix: '.h5p',
                        keep: false
                    })];
            });
        });
    };
    /**
     * If a file is a video, an audio file or an image, the filename is suffixed
     * with the corresponding directory (videos, audios, images).
     * @param filename the filename including the file extension
     * @returns the path including the directory; the same if the filename is not a video, audio file or image
     */
    H5PEditor.prototype.addDirectoryByMimetype = function (filename) {
        var mimetype = mime_types_1["default"].lookup(filename);
        if (mimetype !== false) {
            if (mimetype.startsWith('video')) {
                return "videos/".concat(filename);
            }
            if (mimetype.startsWith('audio')) {
                return "audios/".concat(filename);
            }
            if (mimetype.startsWith('image')) {
                return "images/".concat(filename);
            }
        }
        return filename;
    };
    /**
     * Recursively crawls through the parameters and finds usages of libraries.
     * @param parameters the parameters to scan
     * @param collect a collecting object used by the recursion. Do not use
     * @returns a list of libraries that are referenced in the parameters
     */
    H5PEditor.prototype.findLibrariesInParameters = function (parameters, collect) {
        var _this = this;
        if (collect === void 0) { collect = {}; }
        if (parameters === undefined ||
            parameters === null ||
            typeof parameters !== 'object') {
            return collect;
        }
        Object.keys(parameters).forEach(function (key) {
            if (key === 'library' && typeof parameters[key] === 'string') {
                if (parameters[key].match(/.+ \d+\.\d+/)) {
                    collect[parameters[key]] = LibraryName_1["default"].fromUberName(parameters[key], {
                        useWhitespace: true
                    });
                }
            }
            else {
                _this.findLibrariesInParameters(parameters[key], collect);
            }
        });
        return Object.values(collect);
    };
    H5PEditor.prototype.generateContentMetadata = function (metadata, mainLibrary, contentDependencies) {
        if (contentDependencies === void 0) { contentDependencies = []; }
        return __awaiter(this, void 0, void 0, function () {
            var mainLibraryMetadata, newMetadata, _a, _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        log.info("generating h5p.json");
                        return [4 /*yield*/, this.libraryManager.getLibrary(mainLibrary)];
                    case 1:
                        mainLibraryMetadata = _e.sent();
                        _a = ContentMetadata_1.ContentMetadata.bind;
                        _b = [void 0, metadata,
                            { mainLibrary: mainLibraryMetadata.machineName }];
                        _d = {};
                        _c = [[]];
                        return [4 /*yield*/, this.dependencyGetter.getDependentLibraries(__spreadArray(__spreadArray([], contentDependencies, true), [mainLibrary], false), {
                                preloaded: true
                            }, [mainLibrary])];
                    case 2:
                        newMetadata = new (_a.apply(ContentMetadata_1.ContentMetadata, _b.concat([(_d.preloadedDependencies = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _c.concat([(_e.sent()), true])), [
                                    mainLibrary
                                ], false]),
                                _d)])))();
                        return [2 /*return*/, newMetadata];
                }
            });
        });
    };
    H5PEditor.prototype.generateEditorIntegration = function (contentId, language, user) {
        log.info("generating integration for ".concat(contentId));
        return {
            ajaxPath: this.urlGenerator.ajaxEndpoint(user),
            apiVersion: {
                majorVersion: this.config.coreApiVersion.major,
                minorVersion: this.config.coreApiVersion.minor
            },
            assets: {
                css: this.listCoreStyles(),
                js: this.listCoreScripts(language)
            },
            copyrightSemantics: this.semanticsLocalizer.localize(this.copyrightSemantics, language),
            fileIcon: {
                path: this.urlGenerator.editorLibraryFile('images/binary-file.png'),
                height: 100,
                width: 100
            },
            filesPath: this.urlGenerator.temporaryFiles(),
            libraryUrl: this.urlGenerator.editorLibraryFiles(),
            metadataSemantics: this.semanticsLocalizer.localize(this.metadataSemantics, language),
            nodeVersionId: contentId,
            language: language,
            hub: {
                contentSearchUrl: "".concat(this.config.contentHubContentEndpoint, "/search")
            },
            enableContentHub: this.config.contentHubEnabled
        };
    };
    H5PEditor.prototype.generateIntegration = function (contentId, language, user) {
        return {
            ajax: {
                contentUserData: this.urlGenerator.contentUserData(user),
                setFinished: this.urlGenerator.setFinished(user)
            },
            ajaxPath: this.urlGenerator.ajaxEndpoint(user),
            editor: this.generateEditorIntegration(contentId, language, user),
            hubIsEnabled: true,
            l10n: {
                H5P: this.semanticsLocalizer.localize(defaultClientStrings_json_1["default"], language, true)
            },
            libraryConfig: this.config.libraryConfig,
            postUserStatistics: false,
            saveFreq: false,
            libraryUrl: this.urlGenerator.coreFiles(),
            pluginCacheBuster: this.cacheBusterGenerator(),
            url: this.urlGenerator.baseUrl(),
            fullscreenDisabled: this.config.disableFullscreen ? 1 : 0,
            user: {
                mail: user.email,
                name: user.name,
                id: user.id
            },
            Hub: {
                contentSearchUrl: "".concat(this.config.contentHubContentEndpoint, "/search")
            }
        };
    };
    /**
     * Returns a list of addons that should be used for the library
     * @param machineName the library identified by its machine name
     * @returns a list of addons
     */
    H5PEditor.prototype.getAddonsForLibrary = function (machineName) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function () {
            var installedAddons, neededAddons, _i, installedAddons_1, installedAddon, configRequestedAddons, _l, configRequestedAddons_1, addonMachineName, installedAddonVersions;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        log.debug('Getting list of installed addons.');
                        return [4 /*yield*/, this.libraryManager.listAddons()];
                    case 1:
                        installedAddons = _m.sent();
                        neededAddons = [];
                        // add addons that are required by the H5P library metadata extension
                        for (_i = 0, installedAddons_1 = installedAddons; _i < installedAddons_1.length; _i++) {
                            installedAddon = installedAddons_1[_i];
                            // The property addTo.editor.machineNames is a custom
                            // h5p-nodejs-library extension.
                            if (((_c = (_b = (_a = installedAddon.addTo) === null || _a === void 0 ? void 0 : _a.editor) === null || _b === void 0 ? void 0 : _b.machineNames) === null || _c === void 0 ? void 0 : _c.includes(machineName)) ||
                                ((_f = (_e = (_d = installedAddon.addTo) === null || _d === void 0 ? void 0 : _d.editor) === null || _e === void 0 ? void 0 : _e.machineNames) === null || _f === void 0 ? void 0 : _f.includes('*'))) {
                                log.debug("Addon ".concat(LibraryName_1["default"].toUberName(installedAddon), " will be added to the editor."));
                                neededAddons.push(installedAddon);
                            }
                        }
                        configRequestedAddons = __spreadArray(__spreadArray([], ((_h = (_g = this.config.editorAddons) === null || _g === void 0 ? void 0 : _g[machineName]) !== null && _h !== void 0 ? _h : []), true), ((_k = (_j = this.config.editorAddons) === null || _j === void 0 ? void 0 : _j['*']) !== null && _k !== void 0 ? _k : []), true);
                        _l = 0, configRequestedAddons_1 = configRequestedAddons;
                        _m.label = 2;
                    case 2:
                        if (!(_l < configRequestedAddons_1.length)) return [3 /*break*/, 5];
                        addonMachineName = configRequestedAddons_1[_l];
                        return [4 /*yield*/, this.libraryManager.listInstalledLibraries(addonMachineName)];
                    case 3:
                        installedAddonVersions = _m.sent();
                        if (!neededAddons
                            .map(function (a) { return a.machineName; })
                            .includes(addonMachineName) &&
                            installedAddonVersions[addonMachineName] !== undefined) {
                            log.debug("Addon ".concat(addonMachineName, " will be added to the editor."));
                            neededAddons.push(installedAddonVersions[addonMachineName].sort()[installedAddonVersions[addonMachineName].length - 1]);
                        }
                        _m.label = 4;
                    case 4:
                        _l++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, neededAddons];
                }
            });
        });
    };
    /**
     * Returns a functions that replaces the h5p editor language file with the
     * one for the language desired. Checks if the H5P editor core supports
     * a language and falls back to English if it doesn't. Also removes region
     * suffixes like the US in 'en-US' if it can't find a language file with
     * the suffix.
     * @param language
     */
    H5PEditor.prototype.getLanguageReplacer = function (language) {
        if (editorLanguages_json_1["default"].includes(language)) {
            return function (f) {
                return f.replace('language/en.js', "language/".concat(language, ".js"));
            };
        }
        var languageWithRegion = language.replace(/-.+$/, '');
        if (editorLanguages_json_1["default"].includes(languageWithRegion)) {
            return function (f) {
                return f.replace('language/en.js', "language/".concat(languageWithRegion, ".js"));
            };
        }
        return function (f) { return f; };
    };
    H5PEditor.prototype.listAssets = function (libraryName, language, loaded) {
        var _a, _b, _c, _d;
        if (loaded === void 0) { loaded = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var key, assets, _e, library, translation, addonsForLibrary, combinedDependencies, cssFiles, jsFiles, alteredFiles, parsedLanguageObject;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        key = LibraryName_1["default"].toUberName(libraryName);
                        if (key in loaded) {
                            return [2 /*return*/, null];
                        }
                        loaded[key] = true;
                        assets = {
                            scripts: [],
                            styles: [],
                            translations: {}
                        };
                        return [4 /*yield*/, Promise.all([
                                this.libraryManager.getLibrary(libraryName),
                                this.libraryManager.getLanguage(libraryName, language || 'en')
                            ])];
                    case 1:
                        _e = _f.sent(), library = _e[0], translation = _e[1];
                        return [4 /*yield*/, this.getAddonsForLibrary(library.machineName)];
                    case 2:
                        addonsForLibrary = _f.sent();
                        return [4 /*yield*/, Promise.all([
                                this.resolveDependencies(library.preloadedDependencies || [], language, loaded),
                                this.resolveDependencies(library.editorDependencies || [], language, loaded),
                                addonsForLibrary
                                    ? this.resolveDependencies(addonsForLibrary, language, loaded)
                                    : undefined
                            ])];
                    case 3:
                        combinedDependencies = _f.sent();
                        combinedDependencies.forEach(function (dependencies) {
                            return dependencies.forEach(function (dependency) {
                                dependency.scripts.forEach(function (script) {
                                    return assets.scripts.push(script);
                                });
                                dependency.styles.forEach(function (script) {
                                    return assets.styles.push(script);
                                });
                                Object.keys(dependency.translations).forEach(function (k) {
                                    assets.translations[k] = dependency.translations[k];
                                });
                            });
                        });
                        cssFiles = ((_a = library.preloadedCss) === null || _a === void 0 ? void 0 : _a.map(function (f) { return f.path; })) || [];
                        jsFiles = ((_b = library.preloadedJs) === null || _b === void 0 ? void 0 : _b.map(function (f) { return f.path; })) || [];
                        // If configured in the options, we call a hook to change the files
                        // included for certain libraries.
                        if ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.customization) === null || _d === void 0 ? void 0 : _d.alterLibraryFiles) {
                            log.debug('Calling alterLibraryFiles hook');
                            alteredFiles = this.options.customization.alterLibraryFiles(libraryName, jsFiles, cssFiles);
                            jsFiles = alteredFiles === null || alteredFiles === void 0 ? void 0 : alteredFiles.scripts;
                            cssFiles = alteredFiles === null || alteredFiles === void 0 ? void 0 : alteredFiles.styles;
                        }
                        jsFiles.forEach(function (script) {
                            return assets.scripts.push(_this.urlGenerator.libraryFile(library, script));
                        });
                        cssFiles.forEach(function (style) {
                            return assets.styles.push(_this.urlGenerator.libraryFile(library, style));
                        });
                        try {
                            parsedLanguageObject = JSON.parse(translation);
                        }
                        catch (_g) {
                            parsedLanguageObject = undefined;
                        }
                        if (parsedLanguageObject) {
                            assets.translations[libraryName.machineName] = parsedLanguageObject;
                        }
                        return [2 /*return*/, assets];
                }
            });
        });
    };
    H5PEditor.prototype.listCoreScripts = function (language) {
        var replacer = this.getLanguageReplacer(language);
        return editorAssetList_json_1["default"].scripts.core
            .map(this.urlGenerator.coreFile)
            .concat(editorAssetList_json_1["default"].scripts.editor
            .map(replacer)
            .map(this.urlGenerator.editorLibraryFile))
            .concat(this.globalCustomScripts);
    };
    H5PEditor.prototype.listCoreStyles = function () {
        return editorAssetList_json_1["default"].styles.core
            .map(this.urlGenerator.coreFile)
            .concat(editorAssetList_json_1["default"].styles.editor.map(this.urlGenerator.editorLibraryFile))
            .concat(this.globalCustomStyles);
    };
    H5PEditor.prototype.resolveDependencies = function (originalDependencies, language, loaded) {
        var _this = this;
        var dependencies = originalDependencies.slice();
        var resolved = [];
        var resolve = function (dependency) {
            if (!dependency)
                return Promise.resolve(resolved);
            return _this.listAssets(dependency, language, loaded)
                .then(function (assets) {
                return assets ? resolved.push(assets) : null;
            })
                .then(function () { return resolve(dependencies.shift()); });
        };
        return resolve(dependencies.shift());
    };
    H5PEditor.prototype.validateLanguageCode = function (languageCode) {
        // We are a bit more tolerant than the ISO standard, as there are three
        // character languages codes and country codes like 'hans' for
        // 'zh-hans'.
        if (!/^[a-z]{2,3}(-[A-Z]{2,6})?$/i.test(languageCode)) {
            throw new Error("Language code ".concat(languageCode, " is invalid."));
        }
    };
    return H5PEditor;
}());
exports["default"] = H5PEditor;
//# sourceMappingURL=H5PEditor.js.map