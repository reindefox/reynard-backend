import { color } from "@src/assets/json/colors";
import { AbstractModerationCommand } from "@src/common/abstractions/command/model/AbstractModerationCommand";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { GuildMember, Message, MessageEmbed, User } from "discord.js";

export class ModerationMessageBuilder {
    private readonly _messageEmbed: MessageEmbed = new MessageEmbed();

    constructor(private readonly abstractModerationCommand: AbstractModerationCommand) {
        this._messageEmbed.setColor(color.grey);
        this._messageEmbed.addField(this.abstractModerationCommand.languageRecord.command.moderator, this.abstractModerationCommand.commandData.message.author.toString(), true);
        this._messageEmbed.setDescription("");
    }

    public setActionDescription(content: string): void {
        this._messageEmbed.description += content + "\n";
    }

    public setDuration(duration: { num: number, str: string }): void {
        if (duration) {
            this._messageEmbed.addField(this.abstractModerationCommand.languageRecord.command.duration, duration.str, true);
        }
    }

    public setReason(reason: string): void {
        if (reason?.length > 0) {
            this._messageEmbed.addField(this.abstractModerationCommand.languageRecord.command.reason, reason, true);
        }
    }

    public setTargetUsers(targets: GuildMember[] | User[]): void {
        this._messageEmbed.description += targets[0] instanceof GuildMember ? targets.join("\n") : (<User[]>targets).map(u => u.username).join("\n");
    }

    public async sendMessage(): Promise<Message> {
        return this.abstractModerationCommand.messageService.sendResponseMessageEmbed(this._messageEmbed, SystemMessageType.SUCCESS);
    }

    public get messageEmbed(): MessageEmbed {
        return this._messageEmbed;
    }
}
