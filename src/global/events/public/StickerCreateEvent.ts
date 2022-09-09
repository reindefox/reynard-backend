import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Sticker } from "discord.js";

export default class StickerCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "stickerCreate",
        name: "event.stickerCreate.name",
        category: "event.category.sticker"
    };

    constructor() {
        super(StickerCreateEvent.options);
    }

    public async run(sticker: Sticker): Promise<void> {
        if (!sticker) return;
        if (!sticker.guild) return;

        await this.initialize(sticker.guild, ...arguments);
    }
}
