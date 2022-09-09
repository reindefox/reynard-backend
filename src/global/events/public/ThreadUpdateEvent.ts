import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { ThreadChannel } from "discord.js";

export default class ThreadUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "threadUpdate",
        name: "event.threadUpdate.name",
        category: "event.category.thread"
    };

    constructor() {
        super(ThreadUpdateEvent.options);
    }

    public async run(oldThread: ThreadChannel, newThread: ThreadChannel): Promise<void> {

    }
}
