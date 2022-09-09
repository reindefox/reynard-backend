import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { Message } from "discord.js";
import * as math from "mathjs";

export default class MathCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "math",
        group: "utilities",
        clientPermissions: [],
        memberPermissions: []
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            this.showHelp();
            return;
        }

        const expectedExpression: string = args.join(" ").trim();

        try {
            const result: any = math.evaluate(expectedExpression);

            await this.messageService.sendContentMessage(String(result));
        } catch (e) {
            await this.messageService.sendSystemMessage(this.translate("command.math.error", [expectedExpression]) + "\n\n" + `\`${e.message}\``, SystemMessageType.ERROR);
        }
    }
}
