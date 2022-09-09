import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { ThreadChannel } from "discord.js";

export default class ThreadDeleteEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "threadDelete",
        name: "event.threadDelete.name",
        category: "event.category.thread"
    };

    constructor() {
        super(ThreadDeleteEvent.options);
    }

    public async run(thread: ThreadChannel): Promise<void> {

    }
}
