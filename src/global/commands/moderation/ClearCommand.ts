import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMentionableCommand } from "@src/common/abstractions/command/model/AbstractMentionableCommand";
import { createErrorLog } from "@src/scripts/Logger";
import { NumberFormatUtils } from "@src/utils/NumberFormatUtils";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { Collection, GuildMember, Message, TextChannel } from "discord.js";

export default class ClearCommand extends AbstractMentionableCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "clear",
        group: "moderation",
        memberPermissions: ["MANAGE_MESSAGES"],
        clientPermissions: ["MANAGE_MESSAGES"],
    };

    public static readonly maxDeleteCount: number = 300;

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            this.showHelp();
            return;
        }

        let messagesToDelete: number = NumberFormatUtils.parseInt(args[0]);

        if (messagesToDelete === null) {
            this.showHelp();
            return;
        }

        if (messagesToDelete < 1 || messagesToDelete > ClearCommand.maxDeleteCount) {
            this.showHelp();
            return;
        }

        let expectedMember: GuildMember;
        let deleteType: DeleteType;

        if (args[1]) {
            expectedMember = this.extractTargetMember(args[1]);

            if (expectedMember) {
                deleteType = "userID";
            } else {
                deleteType = this.getLocaleFlag<DeleteType>(args[1]);
            }
        }

        if (!deleteType) {
            await this.messageService.sendErrorMessage();
            return;
        }

        const chunkedNumberList: number[] = NumberFormatUtils.toChunk(messagesToDelete, 100);

        let deletedMessages: number = 0;
        let iterator: number = 0;

        let hasOldMessages: boolean = false;
        let hasPinnedMessages: boolean = false;

        for (const chunkNumber of chunkedNumberList) {
            iterator++;

            const messagesCollection: Collection<string, Message> = await this.commandData.message.channel.messages.fetch({
                limit: chunkNumber + 1 <= 100 ? chunkNumber + 1 : chunkNumber
            });
            let messages: Message[] = messagesCollection
                .filter(m => m.id !== message.id)
                .map(m => m);

            if (!messagesCollection || !messages || messages.length === 0) {
                if (iterator === 1) {
                    await this.messageService.sendSystemMessage(this.languageRecord.command.clear.notFound, SystemMessageType.ERROR);
                    return;
                }

                break;
            }

            switch (deleteType) {
                case "bot": {
                    messages = messages
                        .filter(m => m.author.bot)
                        .map(m => m);
                    break;
                }
                case "member": {
                    messages = messages
                        .filter(m => !m.author.bot)
                        .map(m => m);
                    break;
                }
                case "userID": {
                    messages = messages
                        .filter(m => m.author.id === expectedMember.id)
                        .map(m => m);
                    break;
                }
                default: {
                    break;
                }
            }

            if (!messages || messages.length === 0) {
                break;
            }

            for (const message of messages) {
                const age: number = Math.round((new Date().getTime() - message.createdAt.getTime()) / 1000);

                if (age >= 1209600 || message.pinned) {
                    const index: number = messages.indexOf(message);

                    if (index > -1) {
                        if (age >= 1209600) {
                            messages.splice(index, 1);

                            hasOldMessages = true;
                        }

                        if (message.pinned) {
                            messages.splice(index, 1);

                            hasPinnedMessages = true;
                        }
                    }
                }
            }

            const deleted: number = await this.clearMessages(messages);

            deletedMessages += deleted;

            if (deleted < chunkNumber) {
                break;
            }
        }

        if (deletedMessages > 0) {
            let response: string = this.translate("command.clear.cleared", [deletedMessages]);

            if (hasOldMessages) {
                response += "\n" +
                    this.languageRecord.command.clear.skipped;
            }

            if (hasPinnedMessages) {
                response += "\n" +
                    this.languageRecord.command.clear.pinned;
            }

            await this.messageService.sendSystemMessage(response, SystemMessageType.SUCCESS);
        } else {
            await this.messageService.sendSystemMessage(this.languageRecord.command.clear.notFound, SystemMessageType.ERROR);
        }
    }

    private async clearMessages(messages: Message[]): Promise<number> {
        let deletedMessages: number = 0;

        await (<TextChannel>this.commandData.message.channel)
            .bulkDelete(messages, true)
            .then(m => deletedMessages += m.size)
            .catch(e => createErrorLog(e, __filename));

        return deletedMessages;
    }
}

export type DeleteType =
    "bot"
    | "member"
    | "userID"
