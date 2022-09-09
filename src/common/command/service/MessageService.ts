import { createErrorLog } from "@src/scripts/Logger";
import { BaseMessageUtils } from "@src/common/command/service/BaseMessageUtils";
import { MessageServicePrepared } from "@src/common/command/service/MessageServicePrepared";
import { HexColorString, Message, MessageEmbed, MessageOptions, MessagePayload } from "discord.js";

export class MessageService extends MessageServicePrepared {
    public async sendDefaultMessage(options: string | MessagePayload | MessageOptions): Promise<Message | Message[]> {
        return this.commandData.message.channel.send(options);
    }

    public async sendEmbedMessage(messageEmbed: MessageEmbed, showDev: boolean = false): Promise<Message | Message[]> {
        this.prepareEmbedMessage(messageEmbed, showDev);

        return this.sendMessage({
            embeds: [
                messageEmbed
            ]
        });
    }

    protected async sendMessage(data: string | MessagePayload | MessageOptions): Promise<Message | Message[]> {
        const deleteSource: boolean = this.commandData.commandConfig.delSrcMsg || this.commandData.guildData.delSrcMsg;

        if (deleteSource) {
            MessageService.deleteMessage(this.commandData.message, 0);
        }

        if (!deleteSource) {
            if (this.commandData.guildData.useReplies) {
                if (!this.commandData.command.options.ignoreMentionGuildRule) {
                    Object.assign(data, {
                        allowedMentions: {
                            repliedUser: this.commandData.guildData?.mentionUsers
                        }
                    })
                    return this.commandData.message.reply(Object.assign(data, {
                        allowedMentions: {
                            repliedUser: this.commandData.guildData?.mentionUsers
                        }
                    }))
                        .catch(e => createErrorLog(e, __filename));
                }
            }
        }

        return this.commandData.message.channel.send(data)
            .catch(e => createErrorLog(e, __filename));
    }

    public async sendSystemMessage(text: string, messageType: SystemMessageType): Promise<Message | Message[]> {
        const message: Message | Message[] = await this.sendSystemMessagePrivate(this.prepareSystemMessageArguments(text, messageType));

        this.responseMessageManager(<Message>message, messageType);

        return message;
    }

    public async sendResponseMessageEmbed(messageEmbed: MessageEmbed, messageType: SystemMessageType): Promise<Message> {
        const message: Message = <Message>await this.sendEmbedMessage(messageEmbed);

        this.responseMessageManager(message, messageType);

        return message;
    }

    private responseMessageManager(message: Message, messageType: SystemMessageType): void {
        if (message) {
            switch (messageType) {
                case SystemMessageType.SUCCESS:
                case SystemMessageType.WAIT_ANS: {
                    if (this.commandData.guildData?.delSucMsgAfter > 0) {
                        MessageService.deleteMessage(message, this.commandData.guildData.delSucMsgAfter);
                    }
                    break;
                }
                case SystemMessageType.ERROR:
                case SystemMessageType.MISS_ARGUMENTS:
                case SystemMessageType.MISS_PERMISSIONS: {
                    if (this.commandData.guildData?.delErrMsgAfter > 0) {
                        MessageService.deleteMessage(message, this.commandData.guildData.delErrMsgAfter);
                    }
                    break;
                }
            }
        }
    }

    public async sendErrorMessage(content?: string): Promise<Message | Message[]> {
        return this.sendEmbedMessage(this.prepareErrorMessage(content));
    }

    private static deleteMessage(message: Message | Message[], seconds: number): void {
        setTimeout(() => {
            (<Message>message).delete()
                .catch(() => null);
        }, seconds * 1000);
    }

    public async sendContentMessage(content: string): Promise<Message | Message[]> {
        return this.sendMessage({
            content: BaseMessageUtils.formatBaseStructure(content)
        });
    }

    private async sendSystemMessagePrivate(data: { color: HexColorString, emoji: string, typeStr: string, text: string }): Promise<Message | Message[]> {
        return this.sendEmbedMessage(this.prepareSystemMessageProtected(data));
    }
}

export enum SystemMessageType {
    SUCCESS,
    ERROR,
    MISS_ARGUMENTS,
    MISS_PERMISSIONS,
    WAIT_ANS
}
