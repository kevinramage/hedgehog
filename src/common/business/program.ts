import { program, Command } from "commander";
import { format } from "util";
import { ProgramArgument } from "./programArgument";

export class Program {
    private _name : string;
    private _description : string;
    private _args : ProgramArgument[];

    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
        this._args = [];
    }

    protected addArgument(argument: ProgramArgument) {
        this._args.push(argument);
    }

    public async run() {

        // Options
        this._args.forEach(arg => { arg.run(program as Command); });

        // Common
        program.description(this._description);
        program.version("1.0.0");
        program.parse(process.argv);

        // Help
        program.option('-h, --help', 'help').action(() => {
            console.info(program.usage());
            process.exit(0);
        });

        // Execute program
        console.info(format("- Running program %s ...\n", this._name));
        await this.execute(this.getValues());
        console.info("\n- End ...")
    }

    protected async execute(args: {[key: string]: string}) {
        throw new Error("TO IMPLEMENT");
    }

    private getValues() {
        const values : { [ key: string ] : string } = {};
        this._args.forEach((arg) => {
            const descriptor = Object.getOwnPropertyDescriptor(program, arg.name);
            if (descriptor) {
                values[arg.name] = descriptor.value;
            }
        });
        return values;
    }
}