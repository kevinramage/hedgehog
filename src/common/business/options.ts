export class Options {

    private static _instance : Options;
    public MAX_REDIRECT : number = 10;

    private constructor() {

    }

    public static get instance() {
        if ( !Options._instance ) {
            Options._instance = new Options();
        }
        return Options._instance;
    }
}