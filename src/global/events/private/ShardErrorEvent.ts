import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class ShardErrorEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "shardError",
    };

    constructor() {
        super(ShardErrorEvent.options);
    }

    public async run(error: Error, shardID: number): Promise<void> {
        console.log(`Shard error: (Error: ${error}, ID: ${shardID})`);
    }
}
