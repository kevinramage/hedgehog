import * as url from "url";

/**
 * @class
 * Class to manipulate path
 */
export class PathUtils {

    public static isInDomain(path: string, host: string) {
        if (!PathUtils._isInDomain(path, host)) {
            return PathUtils._isInDomain(path, "www." + host)
        } else {
            return true;
        }
    }
    private static _isInDomain(path: string, host: string) {
        if (path.includes("http")) {
            return url.parse(path).host === host;
        } else {
            return true;
        }
    }

    public static isNavigablePath(path: string) {
        return !path.startsWith("#");
    }

    public static getPathFromUrl(urlToConvert: string) {
        return url.parse(urlToConvert).path;
    }
}