import * as winston from "winston";

/**
 * Represent technology identified during an analysis
 */
export class Technology {
    private _name : string;
    private _version : string;

    /**
     * Constructor
     * @param name technology name
     * @param version technology version
     */
    constructor(name: string, version ?: string) {
        this._name = name;
        this._version = version || "";
    }

    /**
     * Identify if a technology exists or not
     * @param technology technology to search
     * @param technologies session technologies
     * @returns true if the technology exists false else
     */
    public static exists(technology: Technology, technologies: Technology[]) {
        return technologies.find(t => { return t.name === technology.name; }) !== undefined;
    }

    /**
     * Load session technologies
     * @param content content of session technology file
     * @returns technology list
     */
    public static load(content: string) {
        winston.debug("Technology.load");
        const technologies : Technology[] = [];
        try {
            const data = JSON.parse(content) as any[];
            data.forEach(t => {
                technologies.push(new Technology(t.name, t.version));
            });
        } catch (ex) {
            winston.error("Technology.load - Error during parsing", ex);
        }

        return technologies;
    }

    /**
     * Save session technology
     * @param technologies session technologies
     * @returns JSON content
     */
    public static save(technologies: Technology[]) {
        const technologiesFormatted = technologies.map(t => { return {
            name: t._name,
            version: t._version
        }});
        return JSON.stringify(technologiesFormatted);
    }

    public get name() {
        return this._name;
    }

    public set name(value) {
        this._name = value;
    }

    public get version() {
        return this._version;
    }

    public set version(value) {
        this._version = value;
    }
}