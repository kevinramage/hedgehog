import { Test } from "./test";

/**
 * npm start -- [program] [options]
 * program (request, spider, proxy)
 */
class Main {

    async run() {
        // console.info("- Start");
        await new Test().run();
        // console.info("- End");
    }
}

new Main().run();