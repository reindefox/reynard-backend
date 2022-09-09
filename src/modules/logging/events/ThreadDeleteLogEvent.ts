import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { ThreadChannel } from "discord.js";

export default class ThreadDeleteLogEvent extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "threadDelete",
        name: "event.threadDelete.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(ThreadDeleteLogEvent.options, guildDaoManager);
    }

    protected execute(thread: ThreadChannel): void | Promise<void> {

    }
}
