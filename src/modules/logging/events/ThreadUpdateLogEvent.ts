import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { ThreadChannel } from "discord.js";

export default class ThreadUpdateLogEvent extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "threadUpdate",
        name: "event.threadUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(ThreadUpdateLogEvent.options, guildDaoManager);
    }

    protected execute(oldThread: ThreadChannel, newThread: ThreadChannel): void | Promise<void> {

    }
}
