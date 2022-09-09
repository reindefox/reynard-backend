import { AbstractCommand } from "@src/common/abstractions/command/model/AbstractCommand";
import { Message } from "discord.js";

export abstract class AbstractBaseCommand extends AbstractCommand {
    protected async shouldRun(message: Message, args: string[], ...data: unknown[]): Promise<boolean> {
        return true;
    }
}
