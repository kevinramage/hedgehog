import { IProcessor } from "../IProcessor";

export class ComponentProcessor implements IProcessor {

    public process() : Promise<void> {
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    public get NAME() {
        return "COMPONENT";
    }
}