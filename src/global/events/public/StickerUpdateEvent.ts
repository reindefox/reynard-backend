import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Sticker } from "discord.js";

export default class StickerUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "stickerUpdate",
        name: "event.stickerUpdate.name",
        category: "event.category.sticker"
    };

    constructor() {
        super(StickerUpdateEvent.options);
    }

    public async run(oldSticker: Sticker, newSticker: Sticker): Promise<void> {
        if (!oldSticker || !newSticker) return;
        if (!newSticker.guild) return;

        await this.initialize(newSticker.guild, ...arguments);
    }
}
