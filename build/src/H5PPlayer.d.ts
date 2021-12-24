import { ContentId, ContentParameters, IContentStorage, IH5PConfig, IH5PPlayerOptions, IIntegration, ILibraryStorage, IPlayerModel, IUrlGenerator, IUser, ITranslationFunction } from './types';
import { ContentMetadata } from './ContentMetadata';
export default class H5PPlayer {
    private libraryStorage;
    private contentStorage;
    private config;
    private integrationObjectDefaults?;
    private urlGenerator;
    private options?;
    /**
     *
     * @param libraryStorage the storage for libraries (can be read only)
     * @param contentStorage the storage for content (can be read only)
     * @param config the configuration object
     * @param integrationObjectDefaults (optional) the default values to use for
     * the integration object
     * @param urlGenerator creates url strings for files, can be used to
     * customize the paths in an implementation application
     * @param translationCallback a function that is called to retrieve
     * translations of keys in a certain language; the keys use the i18next
     * format (e.g. namespace:key). See the ITranslationFunction documentation
     * for more details.
     * @param options more options to customize the behavior of the player; see
     * IH5PPlayerOptions documentation for more details
     */
    constructor(libraryStorage: ILibraryStorage, contentStorage: IContentStorage, config: IH5PConfig, integrationObjectDefaults?: IIntegration, urlGenerator?: IUrlGenerator, translationCallback?: ITranslationFunction, options?: IH5PPlayerOptions);
    private semanticsLocalizer;
    private globalCustomScripts;
    private globalCustomStyles;
    private libraryManager;
    private renderer;
    /**
     * Creates a frame for displaying H5P content. You can customize this frame
     * by calling setRenderer(...). It normally is enough to call this method
     * with the content id. Only call it with parameters and metadata if don't
     * want to use the IContentStorage object passed into the constructor.
     * @param contentId the content id
     * @param user the user who wants to access the content
     * @param ignoreUserPermission (optional) If set to true, the user object
     * won't be passed to the storage classes for permission checks. You can use
     * this option if you have already checked the user's permission in a
     * different layer.
     * @param parametersOverride (optional) the parameters of a piece of content
     * (=content.json); if you use this option, the parameters won't be loaded
     * from storage
     * @param metadataOverride (optional) the metadata of a piece of content
     * (=h5p.json); if you use this option, the parameters won't be loaded from
     * storage
     * @returns a HTML string that you can insert into your page
     */
    render(contentId: ContentId, user: IUser, language?: string, options?: {
        ignoreUserPermissions?: boolean;
        metadataOverride?: ContentMetadata;
        parametersOverride?: ContentParameters;
        showCopyButton?: boolean;
        showDownloadButton?: boolean;
        showEmbedButton?: boolean;
        showFrame?: boolean;
        showH5PIcon?: boolean;
        showLicenseButton?: boolean;
    }): Promise<string | any>;
    /**
     * Overrides the default renderer.
     * @param renderer
     */
    setRenderer(renderer: (model: IPlayerModel) => string | any): H5PPlayer;
    /**
     *
     * @param dependencies
     * @param libraries
     * @param assets
     * @param loaded
     * @returns aggregated asset lists
     */
    private aggregateAssetsRecursive;
    /**
     * Scans the parameters for occurances of the regex pattern in any string
     * property.
     * @param parameters the parameters (= content.json)
     * @param regex the regex to look for
     * @returns true if the regex occurs in a string inside the parametres
     */
    private checkIfRegexIsInParameters;
    private generateIntegration;
    /**
     * Finds out which adds should be added to the library due to the settings
     * in the global configuration or in the library metadata.
     * @param machineName the machine name of the library to which addons should
     * be added
     * @param installedAddons a list of installed addons on the system
     * @returns the list of addons to install
     */
    private getAddonsByLibrary;
    /**
     * Determines which addons should be used for the parameters. It will scan
     * the parameters for patterns specified by installed addons.
     * @param parameters the parameters to scan
     * @param installedAddons a list of addons installed on the system
     * @returns a list of addons that should be used
     */
    private getAddonsByParameters;
    private getDownloadPath;
    private getMetadata;
    /**
     *
     * @param dependencies
     * @param loaded can be left out in initial call
     */
    private getMetadataRecursive;
    private listCoreScripts;
    private listCoreStyles;
}