import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Snowflake } from "discord.js";

export default class ShardReadyEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "shardReady",
    };

    constructor() {
        super(ShardReadyEvent.options);
    }

    public async run(id: number, unavailableGuilds?: Set<Snowflake>): Promise<void> {
        console.log(`Shard ready: (ID: ${id}, UnavailableGuilds: ${JSON.stringify(unavailableGuilds ? Array.from(unavailableGuilds.values()) : [])})`);
    }
}
