export class PrettyPrint {

    public static printTime(time: number) {

        // Time > 2mn
        if (time > 120000) {
            return Math.round(time / 60000) + " mn";

        // Time > 10s
        } else if (time > 10000) {
            return Math.round(time / 1000) + " s";

        // Default
        } else {
            return time + " ms";
        }
    }

    public static printSize(size: number) {

        // Size > 2Mo
        if (size > 2097152) {
            return Math.round(size / 1048576) + " Mb";

        // Size > 10Ko
        } else if (size > 10240) {
            return Math.round(size / 1024) + " Kb";

        // Default
        } else {
            return size + " bytes";
        }
    }
}