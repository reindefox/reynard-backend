import { color } from "@src/assets/json/colors";
import { emoji } from "@src/assets/json/emoji";
import { properties } from "@src/assets/json/properties";
import { CommandData } from "@src/common/abstractions/command/interfaces/Command";
import { BaseMessageUtils } from "@src/common/command/service/BaseMessageUtils";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { HexColorString, MessageEmbed } from "discord.js";

export class MessageServicePrepared {
    constructor(protected readonly commandData: CommandData) {
    }

    public prepareEmbedMessage(messageEmbed: MessageEmbed, showDev: boolean = false): MessageEmbed {
        if (!messageEmbed.color) {
            const customColor: HexColorString = this.commandData.guildData?.embedColor || color.grey;

            messageEmbed.setColor(customColor);
        }

        if (showDev) {
            if (!messageEmbed.footer) {
                messageEmbed.setFooter(`${properties.website.url}`);
            }
        }

        BaseMessageUtils.formatEmbedStructure(messageEmbed);

        return messageEmbed;
    }

    public prepareSystemMessage(text: string, messageType: SystemMessageType): MessageEmbed {
        return this.prepareSystemMessageProtected(this.prepareSystemMessageArguments(text, messageType));
    }

    public prepareErrorMessage(content?: string): MessageEmbed {
        return this.prepareEmbedMessage(new MessageEmbed()
            .setColor(color.red)
            .setDescription(content
                ? this.commandData.localeService.translate("global.clientError") + "\n\n" + content
                : this.commandData.localeService.translate("global.clientError")
            )
        );
    }

    protected prepareSystemMessageProtected(data: { color: HexColorString, emoji: string, typeStr: string, text: string }): MessageEmbed {
        const content: string = BaseMessageUtils.formatBaseStructure(`${data.emoji} ${data.typeStr}\n\n${data.text}`);

        return this.prepareEmbedMessage(new MessageEmbed()
            .setColor(data.color)
            .setDescription(content)
        );
    }

    protected prepareSystemMessageArguments(text: string, messageType: SystemMessageType): { color: HexColorString, emoji: string, typeStr: string, text: string } {
        switch (messageType) {
            case SystemMessageType.SUCCESS: {
                return {
                    color: color.green,
                    emoji: emoji.success.string,
                    typeStr: this.commandData.localeService.translate("command.response.done"),
                    text: text
                };
            }
            case SystemMessageType.ERROR: {
                return {
                    color: color.red,
                    emoji: emoji.error.string,
                    typeStr: this.commandData.localeService.translate("command.response.error"),
                    text: text
                };
            }
            case SystemMessageType.MISS_ARGUMENTS: {
                return {
                    color: color.red,
                    emoji: emoji.error.string,
                    typeStr: this.commandData.localeService.translate("command.response.missArgs"),
                    text: text
                };
            }
            case SystemMessageType.MISS_PERMISSIONS: {
                return {
                    color: color.red,
                    emoji: emoji.error.string,
                    typeStr: this.commandData.localeService.translate("command.response.missPerms"),
                    text: text
                };
            }
            case SystemMessageType.WAIT_ANS: {
                return {
                    color: color.grey,
                    emoji: emoji.neutral.string,
                    typeStr: this.commandData.localeService.translate("command.response.waitAns"),
                    text: text
                }
            }
        }
    }
}
