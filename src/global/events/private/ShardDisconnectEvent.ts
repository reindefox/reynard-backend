import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { CloseEvent } from "discord.js";

export default class ShardDisconnectEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "shardDisconnect",
    };

    constructor() {
        super(ShardDisconnectEvent.options);
    }

    public async run(event: CloseEvent, id: number): Promise<void> {
        console.log(`Shard disconnect: (Event: ${event}, ID: ${id})`);
    }
}
