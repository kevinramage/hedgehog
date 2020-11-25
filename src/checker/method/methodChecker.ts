import { IChecker } from "../IChecker";

/**
 * Checker to test http method allow by the server
 */
export class MethodChecker implements IChecker {

    /**
     * Run the execution of the checker
     */
    public run(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public static fromArgs(content: string) {
        return null;
    }
}