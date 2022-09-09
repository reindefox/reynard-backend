import { config } from "@src/structures/Application";
import { ShardingManager as DiscordShardingManager } from "discord.js";

export class ShardingManager extends DiscordShardingManager {
    constructor() {
        super("./dist/src/client.js", {
            token: config.clientToken,
            // respawn: false
        });
    }

    public async init(): Promise<void> {
    }
}
