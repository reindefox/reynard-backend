import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { ThreadChannel } from "discord.js";

export default class ThreadCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "threadCreate",
        name: "event.threadCreate.name",
        category: "event.category.thread"
    };

    constructor() {
        super(ThreadCreateEvent.options);
    }

    public async run(thread: ThreadChannel): Promise<void> {

    }
}
