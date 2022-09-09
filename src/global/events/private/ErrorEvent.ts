import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class ErrorEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "error",
    };

    constructor() {
        super(ErrorEvent.options);
    }

    public async run(error: Error): Promise<void> {
        console.log(error);
    }
}
