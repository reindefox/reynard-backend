import { BasePublicController } from "@server/api/controllers/public/base.controller";
import { emoji as emojiList } from "@src/assets/json/emoji";
import { properties } from "@src/assets/json/properties";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { createErrorLog } from "@src/scripts/Logger";
import { ClientTaskManager } from "@src/services/ClientTaskManager";
import { Guild, GuildEmoji } from "discord.js";

export default class ReadyEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "ready",
    };

    constructor() {
        super(ReadyEvent.options);
    }

    public async run(): Promise<void> {
        this.client.user.setActivity(properties.website.url, {type: "PLAYING"});

        this.client.generateInvite({
            scopes: ["bot", "applications.commands"],
            permissions: BasePublicController.defaultClientPermissions
        });

        await ClientTaskManager.loadOnReady(this.client)
            .catch(e => createErrorLog(e, __filename));

        await this.loadEmojiCache();
    }

    private async loadEmojiCache(): Promise<void> {
        const cacheGuild: Guild = <Guild><unknown>await this.client.shard.broadcastEval((client, data) => {
            return client.guilds.cache.get(data.properties.guilds.cacheGuildID);
        }, {
            context: {
                properties: properties
            }
        });

        if (!cacheGuild) {
            console.log("* Failed to get cache guild");
            return;
        }

        for (const [key, value] of Object.entries(emojiList)) {
            if (value.hasOwnProperty("ID")) {
                const emoji: GuildEmoji = cacheGuild.emojis.cache.get((<Record<any, any>>value).ID);

                if (!emoji) {
                    console.log(`* Failed to get ${key} emoji cache`);
                }

                emojiList[key].cache = emoji;
            }
        }
    }
}
