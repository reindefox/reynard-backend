import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { TextChannel } from "discord.js";

export default class WebhookUpdateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "webhookUpdate",
        name: "event.webhookUpdate.name",
        category: "event.category.webhook"
    };

    constructor() {
        super(WebhookUpdateEvent.options);
    }

    public async run(channel: TextChannel): Promise<void> {
        if (!channel) return;

        await this.initialize(channel.guild, ...arguments);
    }
}
