import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { createErrorLog } from "@src/scripts/Logger";
import { CommandHandler } from "@src/common/command/CommandHandler";
import { AutoModerationService } from "@src/common/modules/moderation/service/AutoModerationService";
import { Message } from "discord.js";

export default class MessageEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "messageCreate",
    };

    constructor() {
        super(MessageEvent.options);
    }

    public async run(message: Message): Promise<void> {
        if (!message) return;
        if (message.author.bot) return;
        if (!message.guild.me) return;

        if (message.guild) {
            await this.initialize(message.guild, ...arguments);
        }

        /** Checks if received message is a command */
        await new CommandHandler(message, this.guildDaoManager).register()
            .catch(e => createErrorLog(e, __filename));

        await new AutoModerationService(message, this.guildDaoManager).register()
            .catch(e => createErrorLog(e, __filename));
    }
}
