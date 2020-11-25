/**
 * Interface for a checker (program which run differents requests to inject payloads or test server behaviour)
 */
export interface IChecker {
    run() : Promise<void>;
}