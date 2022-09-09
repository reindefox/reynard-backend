import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { Sticker } from "discord.js";

export default class StickerCreateLogEvent extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "stickerCreate",
        name: "event.stickerCreate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(StickerCreateLogEvent.options, guildDaoManager);
    }

    protected execute(sticker: Sticker): void | Promise<void> {

    }
}
