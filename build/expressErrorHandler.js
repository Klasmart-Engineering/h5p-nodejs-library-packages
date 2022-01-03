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
exports.__esModule = true;
exports.errorHandler = exports.catchAndPassOnErrors = exports.undefinedOrTrue = void 0;
var h5p_server_1 = require("@lumieducation/h5p-server");
function undefinedOrTrue(option) {
    return option === undefined || option;
}
exports.undefinedOrTrue = undefinedOrTrue;
/**
 * Calls the function passed to it and catches errors it throws. These errors
 * are then passed to the next(...) function for proper error handling.
 * You can disable error catching by setting options.handleErrors to false
 * @param fn The function to call
 * @param handleErrors whether to handle errors
 */
var catchAndPassOnErrors = function (fn, handleErrors) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!undefinedOrTrue(handleErrors)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn(req, res)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, next(error_1)];
                case 4: return [2 /*return*/, fn(req, res)];
            }
        });
    }); };
};
exports.catchAndPassOnErrors = catchAndPassOnErrors;
/**
 * An Express middleware that converts NodeJs error objects into error
 * responses the H5P client can understand. Add this middleware as the last
 * entry in your express application and make sure all routes don't throw errors
 * but pass them to the next(...) function. (You must do this manually in async functions!)
 * @param languageOverride the language to use when returning errors.
 * Only has an effect if you use the i18next http middleware, as it relies on
 * req.i18n.changeLanguage to be present. Defaults to auto, which means the
 * a language detector must have detected language and req.t translated to the
 * detected language.
 */ function errorHandler(languageOverride) {
    var _this = this;
    if (languageOverride === void 0) { languageOverride = 'auto'; }
    return function (err, req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var statusCode, statusText, detailsList, clientErrorId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statusCode = 500;
                    statusText = '';
                    clientErrorId = '';
                    if (!(err instanceof h5p_server_1.H5pError)) return [3 /*break*/, 3];
                    if (!(req.t &&
                        req.i18n &&
                        languageOverride &&
                        languageOverride !== 'auto')) return [3 /*break*/, 2];
                    return [4 /*yield*/, req.i18n.changeLanguage(languageOverride)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    statusCode = err.httpStatusCode;
                    statusText =
                        req.t === undefined
                            ? err.errorId
                            : req.t(err.errorId, err.replacements);
                    clientErrorId = err.clientErrorId || '';
                    if (err instanceof h5p_server_1.AggregateH5pError) {
                        detailsList = err.getErrors().map(function (e) { return ({
                            code: e.errorId,
                            message: req.t === undefined
                                ? e.errorId
                                : req.t(e.errorId, e.replacements)
                        }); });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    statusText = err.message;
                    _a.label = 4;
                case 4:
                    res.status(statusCode).json(new h5p_server_1.AjaxErrorResponse(clientErrorId, statusCode, statusText, detailsList));
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=expressErrorHandler.js.map