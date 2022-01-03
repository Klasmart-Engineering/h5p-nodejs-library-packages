"use strict";
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
var h5p_server_1 = require("@lumieducation/h5p-server");
/**
 * This class is part of the Express adapter for the H5PAjaxEndpoint class and
 * maps Express specific properties and methods to the generic H5PAjaxEndpoint
 * methods.
 */
var H5PAjaxExpressController = /** @class */ (function () {
    function H5PAjaxExpressController(h5pEditor) {
        var _this = this;
        this.h5pEditor = h5pEditor;
        /**
         * GET /ajax
         * Get various things through the Ajax endpoint.
         */
        this.getAjax = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ajaxEndpoint.getAjax(req.query.action, req.query.machineName, req.query.majorVersion, req.query.minorVersion, (_a = req.query.language) !== null && _a !== void 0 ? _a : req.language, req.user)];
                    case 1:
                        result = _b.sent();
                        res.status(200).send(result);
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * GET /content/<contentId>/<filename>
         */
        this.getContentFile = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mimetype, stream, stats, range;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ajaxEndpoint.getContentFile(req.params.id, req.params.file, req.user, this.getRange(req))];
                    case 1:
                        _a = _b.sent(), mimetype = _a.mimetype, stream = _a.stream, stats = _a.stats, range = _a.range;
                        if (range) {
                            this.pipeStreamToPartialResponse(req.params.file, stream, res, stats.size, range.start, range.end);
                        }
                        else {
                            this.pipeStreamToResponse(mimetype, stream, res, stats.size);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * GET /params/<contentId>
         */
        this.getContentParameters = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ajaxEndpoint.getContentParameters(req.params.contentId, req.user)];
                    case 1:
                        result = _a.sent();
                        res.status(200).json(result);
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * GET /download/<contentId>
         */
        this.getDownload = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // set filename for the package with .h5p extension
                        res.setHeader('Content-disposition', "attachment; filename=".concat(req.params.contentId, ".h5p"));
                        return [4 /*yield*/, this.ajaxEndpoint.getDownload(req.params.contentId, req.user, res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * GET /libraries/<uberName>/<file>
         */
        this.getLibraryFile = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mimetype, stream, stats;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ajaxEndpoint.getLibraryFile(req.params.uberName, req.params.file)];
                    case 1:
                        _a = _b.sent(), mimetype = _a.mimetype, stream = _a.stream, stats = _a.stats;
                        this.pipeStreamToResponse(mimetype, stream, res, stats.size, {
                            'Cache-Control': 'public, max-age=31536000'
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * GET /temp-files/<file>
         */
        this.getTemporaryContentFile = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mimetype, stream, stats, range;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ajaxEndpoint.getTemporaryFile(req.params.file, req.user, this.getRange(req))];
                    case 1:
                        _a = _b.sent(), mimetype = _a.mimetype, stream = _a.stream, stats = _a.stats, range = _a.range;
                        if (range) {
                            this.pipeStreamToPartialResponse(req.params.file, stream, res, stats.size, range.start, range.end);
                        }
                        else {
                            this.pipeStreamToResponse(mimetype, stream, res, stats.size);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * POST /ajax
         * Post various things through the Ajax endpoint
         * Don't be confused by the fact that many of the requests dealt with here are not
         * really POST requests, but look more like GET requests. This is simply how the H5P
         * client works and we can't change it.
         */
        this.postAjax = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.ajaxEndpoint.postAjax(req.query.action, req.body, (_a = req.query.language) !== null && _a !== void 0 ? _a : req.language, req.user, (_b = req.files) === null || _b === void 0 ? void 0 : _b.file, req.query.id, req.t, (_c = req.files) === null || _c === void 0 ? void 0 : _c.h5p, req.query.hubId)];
                    case 1:
                        result = _d.sent();
                        res.status(200).send(result);
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Retrieves a range that was specified in the HTTP request headers. Returns
         * undefined if no range was specified.
         */
        this.getRange = function (req) {
            return function (fileSize) {
                var range = req.range(fileSize);
                if (range) {
                    if (range === -2) {
                        throw new h5p_server_1.H5pError('malformed-request', {}, 400);
                    }
                    if (range === -1) {
                        throw new h5p_server_1.H5pError('unsatisfiable-range', {}, 416);
                    }
                    if (range.length > 1) {
                        throw new h5p_server_1.H5pError('multipart-ranges-unsupported', {}, 400);
                    }
                    return range[0];
                }
                return undefined;
            };
        };
        /**
         * Pipes the contents of the file to the request object and sets the
         * 206 status code and all necessary headers.
         * @param mimetype the mimetype of the file
         * @param readStream a readable stream of the file (at the start position)
         * @param response the Express response object (a writable stream)
         * @param totalLength the total file size of the file
         * @param start the start of the range
         * @param end the end of the range
         */
        this.pipeStreamToPartialResponse = function (mimetype, readStream, response, totalLength, start, end) {
            response.writeHead(206, {
                'Content-Type': mimetype,
                'Content-Length': end - start + 1,
                'Content-Range': "bytes ".concat(start, "-").concat(end, "/").concat(totalLength)
            });
            readStream.on('error', function (err) {
                response.status(404).end();
            });
            readStream.pipe(response);
        };
        /**
         * Pipes the contents of the file to the request object and sets the
         * 200 status code and all necessary headers to indicate support for ranges.
         * @param mimetype the mimetype of the file
         * @param readStream a readable stream of the file (at the start position)
         * @param response the Express response object (a writable stream)
         * @param contentLength the total file size of the file
         */
        this.pipeStreamToResponse = function (mimetype, readStream, response, contentLength, additionalHeaders) {
            response.writeHead(200, __assign(__assign({}, (additionalHeaders || {})), { 'Content-Type': mimetype, 'Content-Length': contentLength, 'Accept-Ranges': 'bytes' }));
            readStream.on('error', function (err) {
                response.status(404).end();
            });
            readStream.pipe(response);
        };
        this.ajaxEndpoint = new h5p_server_1.H5PAjaxEndpoint(h5pEditor);
    }
    return H5PAjaxExpressController;
}());
exports["default"] = H5PAjaxExpressController;
//# sourceMappingURL=H5PAjaxExpressController.js.map