import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class ShardWarnEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "warn",
    };

    constructor() {
        super(ShardWarnEvent.options);
    }

    public async run(info: string): Promise<void> {
        console.log(info);
    }
}
