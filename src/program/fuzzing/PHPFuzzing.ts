import { PHPFuzzing } from "../../checker/fuzzing/phpFuzzing";
import { Program } from "../../common/business/program";

export class PHPFuzingProgram extends Program {

    constructor() {
        super("PHPFuzzing", "Fuzzing with PHP paths");
    }

    protected async execute() {
        return new Promise<void>(async (resolve) => {
            const argv = process.argv;
            const fuzzing = new PHPFuzzing(argv[0], Number.parseInt(argv[1]));
            await fuzzing.run();
            resolve();
        });
    }
}