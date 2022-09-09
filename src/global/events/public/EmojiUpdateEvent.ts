import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildEmoji } from "discord.js";

export default class EmojiUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "emojiUpdate",
        name: "event.emojiUpdate.name",
        category: "event.category.emoji"
    };

    constructor() {
        super(EmojiUpdateEvent.options);
    }

    public async run(oldEmoji: GuildEmoji, newEmoji: GuildEmoji): Promise<void> {
        if (!oldEmoji || !newEmoji) return;
        if (!oldEmoji.guild || !newEmoji.guild) return;

        await this.initialize(newEmoji.guild, ...arguments);
    }
}
