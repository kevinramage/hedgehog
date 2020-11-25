export class Technology {
    private _name : string;
    private _version : string;

    constructor(name: string, version ?: string) {
        this._name = name;
        this._version = version || "";
    }

    public static exists(technology: Technology, technologies: Technology[]) {
        return technologies.find(t => { return t.name == technology.name; }) != undefined;
    }

    public static load(content: string) {
        const technologies : Technology[] = [];
        try {
            const data = JSON.parse(content) as any[];
            data.forEach(t => { 
                technologies.push(new Technology(t.name, t.version));
            });
        } catch (ex) {}

        return technologies;
    }

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