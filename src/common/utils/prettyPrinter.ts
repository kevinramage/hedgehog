import { format } from "util";
import { Result } from "../business/result";
import { ResultItem } from "../business/resultItem";

/**
 * Class to pretty print
 * @Obsolete
 */
export class PrettyPrint {

    public run(result: Result) {
        this.printHeader(result);
        this.printSummary(result);
        this.printDetails(result);
    }

    private printHeader(result: Result) {
        this.printLine("---------------------------------");
        this.printLine(" - " + result.name );
        this.printLine("---------------------------------");
    }

    private printSummary(result: Result) {
        for (const [key, value] of Object.entries(result)) {
            if ( key != "name" && key != "items") {
                if ( key != "errorMessage" && value != "" ) {
                    this.printLine(format("%s: '%s'", key, value));
                }
            }
        }
        this.printLine("---------------------------------");
        this.printLine("");
    }

    private printDetails(result: Result) {
        result.items.forEach(item => { 
            this.printItemDetails(item);
        });
    }

    private printItemDetails(resultItem: ResultItem) {
        for (const [key, value] of Object.entries(resultItem)) {
            if ( key != "errorMessage" && value != "" ) {
                this.printLine(format("   %s: '%s'", key, value));
            }
        }
        this.printLine("");
    }

    private printLine(line: String) {
        console.info(line);
    }
}