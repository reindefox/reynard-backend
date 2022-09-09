import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildEmoji } from "discord.js";

export default class EmojiCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "emojiCreate",
        name: "event.emojiCreate.name",
        category: "event.category.emoji"
    };

    constructor() {
        super(EmojiCreateEvent.options);
    }

    public async run(emoji: GuildEmoji): Promise<void> {
        if (!emoji) return;
        if (!emoji.guild) return;

        await this.initialize(emoji.guild, ...arguments);
    }
}
