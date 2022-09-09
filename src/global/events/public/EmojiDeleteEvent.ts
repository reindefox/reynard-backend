import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildEmoji } from "discord.js";

export default class EmojiDeleteEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "emojiDelete",
        name: "event.emojiDelete.name",
        category: "event.category.emoji"
    };

    constructor() {
        super(EmojiDeleteEvent.options);
    }

    public async run(emoji: GuildEmoji): Promise<void> {
        if (!emoji) return;
        if (!emoji.guild) return;

        await this.initialize(emoji.guild, ...arguments);
    }
}
