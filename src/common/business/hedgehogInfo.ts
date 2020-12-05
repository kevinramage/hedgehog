import { readFileSync } from "fs";
import * as winston from "winston";

export class HedgeHogInfo {

    private static _infos : any = null;

    /**
     * Read informations from package.json
     */
    private static readInfo() {
        winston.debug("HedgeHogInfo.readInfo");
        if (HedgeHogInfo._infos == null) {
            try {
                const buffer = readFileSync("package.json");
                HedgeHogInfo._infos = JSON.parse(buffer.toString());
            } catch (err) {
                winston.error("HedgeHogInfo.readInfo - Internal error", err);
            }
        }
    }

    /**
     * Get program version
     */
    public static get version() {
        HedgeHogInfo.readInfo();
        return HedgeHogInfo._infos?.version;
    }

    /**
     * Get program description
     */
    public static get description() {
        HedgeHogInfo.readInfo();
        return HedgeHogInfo._infos?.description;
    }
}