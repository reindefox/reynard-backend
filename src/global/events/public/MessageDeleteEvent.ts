import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Message } from "discord.js";

export default class MessageDeleteEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageDelete",
        name: "event.messageDelete.name",
        category: "event.category.message"
    };

    constructor() {
        super(MessageDeleteEvent.options);
    }

    public async run(message: Message): Promise<void> {
        if (!message) return;
        if (!message.guild) return;
        if (message.author.id === this.client.user.id) return;
        if (message.webhookId !== null) return;

        await this.initialize(message.guild, ...arguments);
    }
}
