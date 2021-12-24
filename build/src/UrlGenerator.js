"use strict";
exports.__esModule = true;
/**
 * This class generates URLs for files based on the URLs set in the
 * configuration.
 *
 * It includes a basic cache buster that adds a parameter with the full version
 * to core and library files (e.g. ?version=1.2.3). You can also implement other
 * means of busting caches by implementing IUrlGenerator yourself. It would for
 * example be possible to adding a generic cache buster string instead of adding
 * the version. If you decide to do this, you must be aware of the fact that the
 * JavaScript client generates URLs dynamically in two cases (at the time of
 * writing), both in h5peditor.js:contentUpgrade. This function uses
 * H5PIntegration.pluginCacheBuster, which can be customized by overriding
 * H5PEditor.cacheBusterGenerator.
 *
 * UrlGenerator requires these values to be set in config:
 * - baseUrl
 * - contentFilesUrlPlayerOverride (includes placeholder! See documentation of
 *   config for details!)
 * - contentUserDataUrl
 * - coreUrl
 * - downloadUrl
 * - editorLibraryUrl
 * - h5pVersion
 * - librariesUrl
 * - paramsUrl
 * - playUrl
 * - setFinishedUrl
 * - temporaryFilesUrl
 *
 * The UrlGenerator can also be used to inject CSRF tokens into URLs for POST
 * requests that are sent by the H5P editor core (Joubel's code) over which you
 * don't have any control. You can then check the CSRF tokens in your middleware
 * to authenticate requests.
 */
var UrlGenerator = /** @class */ (function () {
    /**
     * @param config the config
     * @param csrfProtection (optional) If used, you must pass in a function
     * that returns a CSRF query parameter for the user for who a URL is
     * generated; the query parameter will be appended to URLs like this:
     * "baseUrl/ajax/?name=value&action=..." You must specify which routes you
     * want to be protected. If you don't pass in a csrfProtection object, no
     * CSRF tokens will be added to URLs.
     */
    function UrlGenerator(config, csrfProtection) {
        var _this = this;
        this.config = config;
        this.csrfProtection = csrfProtection;
        this.ajaxEndpoint = function (user) {
            var _a, _b;
            if (((_a = _this.csrfProtection) === null || _a === void 0 ? void 0 : _a.queryParamGenerator) &&
                ((_b = _this.csrfProtection) === null || _b === void 0 ? void 0 : _b.protectAjax)) {
                var qs = _this.csrfProtection.queryParamGenerator(user);
                if (qs && qs.name && qs.value) {
                    return "".concat(_this.config.baseUrl).concat(_this.config.ajaxUrl, "?").concat(qs.name, "=").concat(qs.value, "&action=");
                }
            }
            return "".concat(_this.config.baseUrl).concat(_this.config.ajaxUrl, "?action=");
        };
        this.baseUrl = function () { return _this.config.baseUrl; };
        this.contentUserData = function (user) {
            var _a, _b;
            if (((_a = _this.csrfProtection) === null || _a === void 0 ? void 0 : _a.queryParamGenerator) &&
                ((_b = _this.csrfProtection) === null || _b === void 0 ? void 0 : _b.protectContentUserData)) {
                var qs = _this.csrfProtection.queryParamGenerator(user);
                return "".concat(_this.config.baseUrl).concat(_this.config.contentUserDataUrl, "?").concat(qs.name, "=").concat(qs.value);
            }
            return "".concat(_this.config.baseUrl).concat(_this.config.contentUserDataUrl);
        };
        /**
         * Also adds a cache buster based on IH5PConfig.h5pVersion.
         * @param file
         */
        this.coreFile = function (file) {
            return "".concat(_this.baseUrl()).concat(_this.config.coreUrl, "/").concat(file, "?version=").concat(_this.config.h5pVersion);
        };
        this.coreFiles = function () {
            return "".concat(_this.baseUrl()).concat(_this.config.coreUrl, "/js");
        };
        this.downloadPackage = function (contentId) {
            return "".concat(_this.baseUrl()).concat(_this.config.downloadUrl, "/").concat(contentId);
        };
        /**
         * Also adds a cache buster based on IH5PConfig.h5pVersion.
         * @param file
         */
        this.editorLibraryFile = function (file) {
            return "".concat(_this.baseUrl()).concat(_this.config.editorLibraryUrl, "/").concat(file, "?version=").concat(_this.config.h5pVersion);
        };
        this.editorLibraryFiles = function () {
            return "".concat(_this.baseUrl()).concat(_this.config.editorLibraryUrl, "/");
        };
        this.libraryFile = function (library, file) {
            if (file.startsWith('http://') ||
                file.startsWith('https://') ||
                file.startsWith('/')) {
                return file;
            }
            return "".concat(_this.baseUrl()).concat(_this.config.librariesUrl, "/").concat(library.machineName, "-").concat(library.majorVersion, ".").concat(library.minorVersion, "/").concat(file, "?version=").concat(library.majorVersion, ".").concat(library.minorVersion, ".").concat(library.patchVersion);
        };
        this.parameters = function () {
            return "".concat(_this.baseUrl()).concat(_this.config.paramsUrl);
        };
        this.play = function () { return "".concat(_this.baseUrl()).concat(_this.config.playUrl); };
        this.setFinished = function (user) {
            var _a, _b;
            if (((_a = _this.csrfProtection) === null || _a === void 0 ? void 0 : _a.queryParamGenerator) &&
                ((_b = _this.csrfProtection) === null || _b === void 0 ? void 0 : _b.protectSetFinished)) {
                var qs = _this.csrfProtection.queryParamGenerator(user);
                return "".concat(_this.config.baseUrl).concat(_this.config.setFinishedUrl, "?").concat(qs.name, "=").concat(qs.value);
            }
            return "".concat(_this.config.baseUrl).concat(_this.config.setFinishedUrl);
        };
        this.temporaryFiles = function () {
            return _this.baseUrl() + _this.config.temporaryFilesUrl;
        };
    }
    UrlGenerator.prototype.contentFilesUrl = function (contentId) {
        var _a;
        return (_a = this.config.contentFilesUrlPlayerOverride) === null || _a === void 0 ? void 0 : _a.replace('{{contentId}}', contentId);
    };
    UrlGenerator.prototype.uniqueContentUrl = function (contentId) {
        return contentId;
    };
    return UrlGenerator;
}());
exports["default"] = UrlGenerator;
//# sourceMappingURL=UrlGenerator.js.map