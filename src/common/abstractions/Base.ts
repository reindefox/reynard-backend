import { Reynard } from "@src/structures/Reynard";

export abstract class Base {
    public readonly client: Reynard;

    protected constructor() {
        this.client = Reynard.client;
    }
}
