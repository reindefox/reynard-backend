import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Message } from "discord.js";

export default class MessageUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageUpdate",
        name: "event.messageUpdate.name",
        category: "event.category.message"
    };

    constructor() {
        super(MessageUpdateEvent.options);
    }

    public async run(oldMessage: Message, newMessage: Message): Promise<void> {
        if (!oldMessage || !newMessage) return;
        if (!newMessage.guild || !oldMessage.guild) return;

        if (newMessage.content !== oldMessage.content) {
            await this.initialize(newMessage.guild, ...arguments);
        }
    }
}
