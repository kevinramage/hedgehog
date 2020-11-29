import OPTIONS_FILE = require("../../config/options.json");

/**
 * System options
 * Class to read the system options
 */
export class Options {

    private static _instance : Options;

    private constructor() {}

    /**
     * Get the option value from its key
     * @param key key to search
     */
    public option(key: string) {
        if (OPTIONS_FILE) {
            const descriptor = Object.getOwnPropertyDescriptor(OPTIONS_FILE, key);
            if (descriptor) {
                return descriptor.value;
            }
        }
        return undefined;
    }

    /**
     * Get the unique instance (Singleton)
     */
    public static get instance() {
        if (!Options._instance) {
            Options._instance = new Options();
        }
        return Options._instance;
    }
}

export enum OPTIONS {
    PORTLISTENER_TIMEOUT = "portListener.timeout",
    REQUEST_MAXREDIRECT = "request.maxRedirect"
}