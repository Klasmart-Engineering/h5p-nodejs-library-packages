"use strict";
exports.__esModule = true;
var flat_1 = require("flat");
/**
 * This class performs translations using a simple object with string keys as
 * a place to look up the translations. Can be used in tests and as a fallback
 * when the implementation does not pass a translation function.
 * Uses namespaces but does not support multiple languages.
 */
var SimpleTranslator = /** @class */ (function () {
    /**
     * @param translationStrings an object containing all relevant translation strings
     * sorted by namespaces
     */
    function SimpleTranslator(translationStrings) {
        var _this = this;
        /**
         * Translates a string using the key (identified).
         * @params key the key with optional namespace separated by a colon (e.g.
         * namespace:key)
         * @returns the translated string
         * @memberof SimpleTranslator
         */
        this.t = function (key) {
            var _a;
            var matches = /^(.+):(.+)$/.exec(key);
            if ((matches === null || matches === void 0 ? void 0 : matches.length) > 0) {
                return (_a = _this.translationStrings[matches[1]][matches[2]]) !== null && _a !== void 0 ? _a : key;
            }
            return key;
        };
        this.translationStrings = {};
        for (var _i = 0, _a = Object.keys(translationStrings); _i < _a.length; _i++) {
            var namespace = _a[_i];
            this.translationStrings[namespace] = (0, flat_1.flatten)(translationStrings[namespace]);
        }
    }
    return SimpleTranslator;
}());
exports["default"] = SimpleTranslator;
//# sourceMappingURL=SimpleTranslator.js.map