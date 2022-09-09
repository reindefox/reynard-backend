import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Interaction } from "discord.js";

export default class InteractionCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "interactionCreate"
    };

    constructor() {
        super(InteractionCreateEvent.options);
    }

    public async run(interaction: Interaction): Promise<void> {
        if (interaction.isCommand()) {
            
        }
    }
}
