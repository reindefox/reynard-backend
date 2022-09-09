export const {config} = require("../assets/config/" + String(process.env.CONFIG).trim());

import { API } from "@server/api/api";
import { TwitchPosting } from "@src/api/subscriptions/twitch/TwitchPosting";
import { createErrorLog } from "@src/scripts/Logger";
import { ShardingManager } from "@src/structures/ShardingManager";
import { Collection, Shard } from "discord.js";

export class Application {
    public static readonly developmentMode: boolean = String(process.env.CONFIG).trim() === "dev_config";

    public static shardingManager: ShardingManager;
    public static api: API;
    public static twitchPosting: TwitchPosting;

    private constructor() {
    }

    public static async start(): Promise<void> {
        /* Sharding */
        Application.shardingManager = new ShardingManager();

        await Application.shardingManager.spawn()
            .then((e: Collection<number, Shard>) => {
                console.log(`- Shards (${e.size}) have been started`);
            })
            .catch(e => createErrorLog(e, __filename, true, "An error occurred while creating shards."));

        /* API Server */
        Application.api = API.instance;

        await Application.api.init()
            .catch(e => createErrorLog(e, __filename, true, "An error occurred while initializing API server."));

        /* Rest application */
        const LateInitApplication: any = require("../scripts/LateInitApplication").LateInitApplication;
        await LateInitApplication.lateInit();
    }
}
