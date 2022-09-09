import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class ShardReconnectingEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "shardReconnecting",
    };

    constructor() {
        super(ShardReconnectingEvent.options);
    }

    public async run(id: number): Promise<void> {
        console.log(`Shard reconnecting: (ID: ${id})`);
    }
}
