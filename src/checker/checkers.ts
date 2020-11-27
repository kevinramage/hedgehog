import { PHPFuzzing } from "../checker/fuzzing/phpFuzzing";
import { CertificateChecker } from "./certificate/certificateChecker";
import { CipherChecker } from "./cipher/cipherChecker";
import { IChecker } from "./IChecker";
import { MethodChecker } from "./method/methodChecker";
import { PortListenerChecker } from "./port/portListenerChecker";
import { SSLMethodChecker } from "./sslMethod/sslMethodChecker";
import { ErrorPageChecker } from "./version/errorPageChecker";

export class Checkers {

    public static identifyChecker(checkerName: string, args: string) : IChecker | null {
        switch (checkerName) {
            case CertificateChecker.name:
                return CertificateChecker.fromArgs(args);
            case CipherChecker.name:
                return CipherChecker.fromArgs(args);
            case PHPFuzzing.name:
                return PHPFuzzing.fromArgs(args);
            case MethodChecker.name:
                return MethodChecker.fromArgs(args);
            case PortListenerChecker.name:
                return PortListenerChecker.fromArgs(args);
            case SSLMethodChecker.name:
                return SSLMethodChecker.fromArgs(args);
            case ErrorPageChecker.name:
                return ErrorPageChecker.fromArgs(args);
        }
        return null;
    }
}