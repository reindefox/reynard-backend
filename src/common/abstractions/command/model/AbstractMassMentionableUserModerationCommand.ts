import { inlineCode } from "@discordjs/builders";
import { AbstractMentionableCommand } from "@src/common/abstractions/command/model/AbstractMentionableCommand";
import { AbstractModerationCommand } from "@src/common/abstractions/command/model/AbstractModerationCommand";
import { InfractionActionType } from "@src/database/structures/InfractionActions";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { GuildMember, Message } from "discord.js";

export abstract class AbstractMassMentionableUserModerationCommand extends AbstractModerationCommand {
    public static readonly mentionsLimit: number = 3;

    protected async shouldRun(message: Message, args: string[]): Promise<boolean> {
        if (!await super.shouldRun(message, args)) {
            return false;
        }

        const allMentions: string[] = AbstractMentionableCommand.getAllMentions(args);

        if (allMentions.length > AbstractMassMentionableUserModerationCommand.mentionsLimit) {
            this.maxMentionsException();
            return false;
        }

        const userIDList: string[] = [...new Set(this.userIDList.concat(this.members.map(m => m.user.id)))];

        if (userIDList.length === 0) {
            this.showHelp();
            return false;
        }

        if (userIDList.includes(message.author.id)) {
            this.selfActionException();
            return false;
        }

        if ((<Record<any, any>>this.options).disableBots && this.members.filter(m => m.user.bot).length > 0) {
            this.botActionException();
            return;
        }

        const client: GuildMember = this.commandData.message.guild.me;

        if (userIDList.includes(client.user.id)) {
            this.clientActionException();
            return false;
        }

        if (userIDList.includes(message.guild.ownerId)) {
            this.ownerActionException();
            return false;
        }

        const executorHigherRoleMembers: GuildMember[] = [];
        const executor: GuildMember = this.commandData.message.member;

        if (executor.id !== message.guild.ownerId) {
            for (const member of this.members) {
                if (member.roles?.highest?.position > executor.roles?.highest?.position) {
                    executorHigherRoleMembers.push(member);
                }
            }

            if (executorHigherRoleMembers.length > 0) {
                this.executorLowRoleException(executorHigherRoleMembers);
                return false;
            }
        }

        const clientHigherRoleMembers: GuildMember[] = [];

        for (const member of this.members) {
            if (member.roles?.highest?.position > client?.roles?.highest?.position) {
                clientHigherRoleMembers.push(member);
            }
        }

        if (clientHigherRoleMembers.length > 0) {
            this.clientLowRoleException(clientHigherRoleMembers);
            return false;
        }

        return true;
    }

    private maxMentionsException(): void {
        void this.messageService.sendSystemMessage(inlineCode(this.translate("command.run.maxMentions", [AbstractMassMentionableUserModerationCommand.mentionsLimit])), SystemMessageType.ERROR);
    }
}

export interface PunishmentInterface {
    member: GuildMember;
    type: InfractionActionType;
}
