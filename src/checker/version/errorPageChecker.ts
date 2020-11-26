import { IChecker } from "../IChecker";


/**
 * Checker to compare error page and default error pages
 */
export class ErrorPageChecker implements IChecker {

    run(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public static fromArgs(content: string) {
        return null;
    }
}