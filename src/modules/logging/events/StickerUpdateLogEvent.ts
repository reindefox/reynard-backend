import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Sticker } from "discord.js";

export default class StickerUpdateLogEvent extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "stickerUpdate",
        name: "event.stickerUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(StickerUpdateLogEvent.options, guildDaoManager);
    }

    protected execute(newSticker: Sticker, oldSticker: Sticker): void | Promise<void> {

    }
}
