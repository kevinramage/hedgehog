/**
 * @class
 * Class to extract version
 */
export class VersionUtils {

    /**
     * Detect the version from content
     * @param text content to analyze
     */
    public static detectVersion(text: string) {
        const regex = /^(?<product>[a-z|A-Z|0-9|\.|\-|_|\s]+)(\/(?<version>[0-9]+(\.[0-9]+)*))?/g;
        const match = regex.exec(text);
        if ( match && match.groups && match.groups.product ) {
            if ( match.groups.version ) {
                return { product : match.groups.product, version: match.groups.version };
            } else {
                return { product : match.groups.product, version: "" };
            }
        } else {
            return { product : text, version: "" };
        }
    }
}