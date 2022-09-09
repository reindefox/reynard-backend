import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMentionableCommand } from "@src/common/abstractions/command/model/AbstractMentionableCommand";
import { SlowMode, SlowModeModel } from "@src/database/models/SlowMode";
import { createErrorLog } from "@src/scripts/Logger";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { Message, TextChannel } from "discord.js";

export default class SlowModeCommand extends AbstractMentionableCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "slowmode",
        group: "moderation",
        memberPermissions: ["MANAGE_CHANNELS"],
        clientPermissions: ["MANAGE_CHANNELS"]
    };

    public static readonly maxCoolDownDuration: number = 21600;

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            this.showHelp();
            return;
        }

        const duration: { num: number, str: string } = this.getDurationArgument([args[0]]);

        if (duration === null || duration.num > SlowModeCommand.maxCoolDownDuration || duration.num < 0) {
            this.showHelp();
            return;
        }

        (<TextChannel>message.channel).setRateLimitPerUser(duration.num)
            .catch((e) => createErrorLog(e, __filename));

        if (args[1] && duration.num > 0) {
            const expectedNumber: { num: number, str: string } = this.getDurationArgument([args[1]]);

            if (expectedNumber) {
                const slowMode: [SlowModeModel, boolean] = await SlowMode.findOrCreate({
                    where: {
                        guildID: message.guild.id,
                        channelID: message.channel.id,
                    },
                    defaults: {
                        guildID: message.guild.id,
                        channelID: message.channel.id,
                        timestamp: Math.floor(new Date().getTime() / 1000),
                        duration: expectedNumber.num
                    }
                });

                if (!slowMode[1]) {
                    slowMode[0].timestamp = Math.floor(new Date().getTime() / 1000);
                    slowMode[0].duration = expectedNumber.num;
                    await slowMode[0].save();
                }

                await this.messageService.sendResponseMessageEmbed(
                    this.messageService.prepareSystemMessage(this.translate("command.slowmode.setToNumber", [duration.str]), SystemMessageType.SUCCESS)
                        .addField(this.languageRecord.command.duration, expectedNumber.str), SystemMessageType.SUCCESS);

                return;
            }
        }

        const slowMode: SlowModeModel = await SlowMode.findOne({
            where: {
                guildID: message.guild.id,
                channelID: message.channel.id,
            }
        });

        if (slowMode) {
            await slowMode.destroy();
        }

        if (duration.num > 0) {
            await this.messageService.sendSystemMessage(this.translate("command.slowmode.setToNumber", [duration.str]), SystemMessageType.SUCCESS);
        } else {
            await this.messageService.sendSystemMessage(this.languageRecord.command.slowmode.disabled, SystemMessageType.SUCCESS);
        }
    }
}
