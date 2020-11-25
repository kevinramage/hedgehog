/*
import { PrettyPrint } from "../../../common/utils/prettyPrinter";
import { Program } from "../../../common/business/program";
import { ProgramArgument } from "../../../common/business/programArgument";
import { SSLProcolChecker } from "../sslMethodChecker";

export class SSLProtocolProgram extends Program {
    private static NAME = "SSLProtocolProgram";
    private static DESCRIPTION = "Check the SSL protocol enabled on a server";
    private static SERVERNAME = "serverName";
    private static PORT = "port";

    constructor() {
        super(SSLProtocolProgram.NAME, SSLProtocolProgram.DESCRIPTION);
        this.addArgument(new ProgramArgument("s", "serverName", SSLProtocolProgram.SERVERNAME, "Server name to check").required());
        this.addArgument(new ProgramArgument("p", "port", SSLProtocolProgram.PORT, "Server port to check").defaultValue("443"));
    }

    protected async execute(args: {[key: string]: string}) {
        const serverName = args[SSLProtocolProgram.SERVERNAME];
        const port = Number.parseInt( args[SSLProtocolProgram.PORT] );
        const check = new SSLProcolChecker(serverName, port);
        const result = await check.run();
        new PrettyPrint().run(result);
    }
}

new SSLProtocolProgram().run();
*/