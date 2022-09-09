import { Application } from "@src/structures/Application";
import { Snowflake } from "discord.js";

export class ShardUtils {
    public static getShardID(guildID: Snowflake): number {
        return Number((BigInt(guildID) >> 22n) % BigInt(Application.shardingManager.shards.size));
    }
}
