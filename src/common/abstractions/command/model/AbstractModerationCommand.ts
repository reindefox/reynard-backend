import { color } from "@src/assets/json/colors";
import { AbstractMassMentionableUserCommand } from "@src/common/abstractions/command/model/AbstractMassMentionableUserCommand";
import { ModerationMessageBuilder } from "@src/common/command/service/ModerationMessageBuilder";
import { ModerationActionRequest } from "@src/common/modules/moderation/interfaces/ModerationActionRequest";
import { Message, MessageEmbed, User } from "discord.js";

export abstract class AbstractModerationCommand extends AbstractMassMentionableUserCommand {
    private readonly _moderationMessageBuilder = new ModerationMessageBuilder(this);

    protected get moderationMessageBuilder(): ModerationMessageBuilder {
        return this._moderationMessageBuilder;
    }

    protected sendResponseToUser(user: User, moderationActionType: PunishmentType, moderationActionRequest: ModerationActionRequest): Promise<Message | Message[]> {
        if (this.commandData.guildData.notifyOnPunishment) {
            const messageEmbed: MessageEmbed = new MessageEmbed()
                .setColor(color.grey)
                .setAuthor(this.commandData.message.guild.name, this.commandData.message.guild.iconURL());

            if (moderationActionRequest.reason) {
                messageEmbed.addField(this.languageRecord.command.reason, moderationActionRequest.reason);
            }

            switch (moderationActionType) {
                case "mute": {
                    messageEmbed.setDescription(this.languageRecord.rest.dmModerationResponse.mute);

                    break;
                }
                case "ban": {
                    messageEmbed.setDescription(this.languageRecord.rest.dmModerationResponse.ban);

                    break;
                }
                case "warn": {
                    messageEmbed.setDescription(this.languageRecord.rest.dmModerationResponse.warn);

                    break;
                }
                case "kick": {
                    messageEmbed.setDescription(this.languageRecord.rest.dmModerationResponse.kick);

                    break;
                }
                default: {
                    return null;
                }
            }

            if (this.duration) {
                messageEmbed.addField(this.languageRecord.command.duration, this.duration.str);
            }

            messageEmbed.addField(this.languageRecord.command.moderator, moderationActionRequest.invoker.toString());

            return user.send({
                embeds: [
                    messageEmbed
                ]
            });
        }

        return null;
    }
}

export type PunishmentType =
    "kick"
    | "ban"
    | "warn"
    | "mute"
