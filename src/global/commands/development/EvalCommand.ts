import { color } from "@src/assets/json/colors";
import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { Message, MessageEmbed } from "discord.js";

export default class EvalCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "eval",
        developerOnly: true,
        group: "development",
        clientPermissions: [],
        memberPermissions: []
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            await this.messageService.sendSystemMessage("^^^", SystemMessageType.MISS_ARGUMENTS);
            return;
        }

        const messageEmbed: MessageEmbed = new MessageEmbed()
            .setAuthor("Code Evaluation");

        try {
            const command: string = args.join(" ");
            messageEmbed.setColor(color.blue);

            EvalCommand.returnEmbedField(messageEmbed, "Input", FormatUtils.formatContent(FormatUtils.sliceContent(command, 900)));

            const evalCommand = await eval(command);

            EvalCommand.returnEmbedField(messageEmbed, "Output", FormatUtils.formatContent(FormatUtils.sliceContent(JSON.parse(JSON.stringify(evalCommand)), 900)));
            EvalCommand.returnEmbedField(messageEmbed, "Type", evalCommand.constructor.name);
        } catch (e) {
            messageEmbed.setColor(color.red);
            EvalCommand.returnEmbedField(messageEmbed, "Output", FormatUtils.formatContent(FormatUtils.sliceContent(JSON.parse(JSON.stringify(e.message)), 900)));
            EvalCommand.returnEmbedField(messageEmbed, "Type", e.constructor.name);
        }

        await this.messageService.sendEmbedMessage(messageEmbed, true);
    }

    private static returnEmbedField(messageEmbed: MessageEmbed, name: string, value: string): void {
        messageEmbed.addField(name,
            `\`\`\`ts\n${value}\`\`\``);
    }
}
