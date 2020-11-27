import { IChecker } from "../IChecker";


/**
 * Checker to analyze the server certificate and analyze it
 */
export class CertificateChecker implements IChecker {

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