import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class DebugEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "debug",
    };

    constructor() {
        super(DebugEvent.options);
    }

    public async run(info: string): Promise<void> {
        console.log(info);
    }
}
