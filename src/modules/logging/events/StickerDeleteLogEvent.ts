import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Sticker } from "discord.js";

export default class StickerDeleteLogEvent extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "stickerDelete",
        name: "event.stickerDelete.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(StickerDeleteLogEvent.options, guildDaoManager);
    }

    protected execute(sticker: Sticker): void | Promise<void> {

    }
}
