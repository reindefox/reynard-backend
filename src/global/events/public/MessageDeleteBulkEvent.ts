import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Collection, Message, Snowflake } from "discord.js";

export default class MessageDeleteBulkEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageDeleteBulk",
        name: "event.messageDeleteBulk.name",
        category: "event.category.message"
    };

    constructor() {
        super(MessageDeleteBulkEvent.options);
    }

    public async run(messages: Collection<Snowflake, Message>): Promise<void> {
        if (!messages) return;
        if (!messages.first().guild) return;

        await this.initialize(messages.first().guild, ...arguments);
    }
}
