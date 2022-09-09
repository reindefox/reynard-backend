import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Message } from "discord.js";

export default class MessageReactionRemoveAllEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageReactionRemoveAll",
        name: "event.messageReactionRemoveAll.name",
        category: "event.category.message"
    };

    constructor() {
        super(MessageReactionRemoveAllEvent.options);
    }

    public async run(message: Message): Promise<void> {
        if (!message) return;
        if (!message.guild) return;

        await this.initialize(message.guild, ...arguments);
    }
}
