import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Sticker } from "discord.js";

export default class StickerDeleteEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "stickerDelete",
        name: "event.stickerDelete.name",
        category: "event.category.sticker"
    };

    constructor() {
        super(StickerDeleteEvent.options);
    }

    public async run(sticker: Sticker): Promise<void> {
        if (!sticker) return;
        if (!sticker.guild) return;

        await this.initialize(sticker.guild, ...arguments);
    }
}
