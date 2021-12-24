"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var debug_1 = __importDefault(require("debug"));
var LogLevelNumber;
(function (LogLevelNumber) {
    LogLevelNumber[LogLevelNumber["error"] = 0] = "error";
    LogLevelNumber[LogLevelNumber["warn"] = 1] = "warn";
    LogLevelNumber[LogLevelNumber["info"] = 2] = "info";
    LogLevelNumber[LogLevelNumber["verbose"] = 3] = "verbose";
    LogLevelNumber[LogLevelNumber["debug"] = 4] = "debug";
    LogLevelNumber[LogLevelNumber["silly"] = 5] = "silly";
})(LogLevelNumber || (LogLevelNumber = {}));
var Logger = /** @class */ (function () {
    function Logger(scope) {
        this.scope = scope;
        var d = (0, debug_1["default"])("h5p:".concat(this.scope));
        this.DEBUG = d;
        this.ERROR = d;
        this.INFO = d;
        this.SILLY = d;
        this.VERBOSE = d;
        this.WARN = d;
        this.logLevel = process.env.LOG_LEVEL || 'info';
    }
    Logger.prototype.debug = function (message) {
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.debug) {
            this.DEBUG(message);
        }
    };
    Logger.prototype.error = function (message) {
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.error) {
            this.ERROR(message);
        }
    };
    Logger.prototype.info = function (message) {
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.info) {
            this.INFO(message);
        }
    };
    Logger.prototype.silly = function (message) {
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.silly) {
            this.SILLY(message);
        }
    };
    Logger.prototype.verbose = function (message) {
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.verbose) {
            this.VERBOSE(message);
        }
    };
    Logger.prototype.warn = function (message) {
        if (LogLevelNumber[this.logLevel] >= LogLevelNumber.warn) {
            this.WARN(message);
        }
    };
    return Logger;
}());
exports["default"] = Logger;
//# sourceMappingURL=Logger.js.map