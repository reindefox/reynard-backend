import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class InvalidatedEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "invalidated",
    };

    constructor() {
        super(InvalidatedEvent.options);
    }

    public async run(): Promise<void> {
        console.log(`Invalidated Process`);
    }
}
