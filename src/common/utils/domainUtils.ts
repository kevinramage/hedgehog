export class DomainUtils {

    /**
     * Check if the host name in included in the certificate common name
     * /// TODO To implement
     * @param commonName certificate common name
     * @param host host name to check
     */
    public static isIncludedInCommonName(commonName: string, host: string) {
        return commonName === host;
    }
}