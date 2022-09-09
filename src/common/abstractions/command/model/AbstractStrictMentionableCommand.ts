import { AbstractMentionableCommand } from "@src/common/abstractions/command/model/AbstractMentionableCommand";
import { Message } from "discord.js";

export abstract class AbstractStrictMentionableCommand extends AbstractMentionableCommand {
    protected async shouldRun(message: Message, args: string[]): Promise<boolean> {
        if (!await this.includesMentions(message, args)) {
            this.showHelp();
            return false;
        }

        return true;
    }
}
