import { inlineCode } from "@discordjs/builders";
import { IsSnowflakeStatic } from "@server/api/validators/is-snowflake.validator";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { TimeParser } from "@src/utils/TimeParser";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { Channel, GuildChannel, GuildMember, Message, Role } from "discord.js";

export abstract class AbstractMentionableCommand extends AbstractBaseCommand {
    private _referenceMember: GuildMember;

    protected async includesMentions(message: Message, args: string[]): Promise<boolean> {
        if (AbstractMentionableCommand.hasAnyID(args)) {
            return true;
        } else {
            if (message.reference) {
                this._referenceMember = (await message.channel.messages.fetch(message.reference.messageId))?.member;

                if (this._referenceMember) {
                    return true;
                }
            }
        }

        return false;
    }

    protected getMentionData<T>(mentions: string[], fetchType: FetchType): T[] {
        const fetched: T[] = [];

        for (const mention of mentions) {
            if (this.commandData.message.guild.hasOwnProperty(fetchType)) {
                const data: T = <T><unknown>this.commandData.message.guild![fetchType].cache.get(mention);
                if (data && !fetched.includes(data)) {
                    fetched.push(data);
                }
            }
        }

        return fetched;
    }

    protected static getAllMentions(args: string[], limit?: number): string[] {
        const mentions: string[] = [];

        for (const arg of args) {
            const extracted: string = AbstractMentionableCommand.extractID(arg);
            if (AbstractMentionableCommand.isID(arg)) {
                mentions.push(extracted);
            } else {
                break;
            }
        }

        if (limit) {
            mentions.splice(limit);
        }

        return mentions;
    }

    private static hasAnyID(args: string[]): boolean {
        if (args) {
            for (const arg of args) {
                if (AbstractMentionableCommand.isID(arg)) {
                    return true;
                }
            }
        }

        return false;
    }

    protected static extractID(args: string): string {
        return args.replace(/[^\d]*/g, "");
    }

    private static isID(args: string): boolean {
        const extracted: string = AbstractMentionableCommand.extractID(args);

        return IsSnowflakeStatic(extracted);
    }

    protected extractTargetChannel(argument?: string): Channel {
        if (this.commandData.message.mentions?.channels?.first()) {
            return this.commandData.message.mentions?.channels?.first();
        }

        if (argument) {
            return <GuildChannel>this.commandData.message.channel;
        } else {
            const targetChannelID: string = AbstractMentionableCommand.extractID(argument);

            return <GuildChannel>(this.commandData.message.mentions?.channels?.first()
                || this.commandData.message.guild.channels.cache.find(ch => ch.id === targetChannelID)
                || this.commandData.message.channel);
        }
    }

    protected extractTargetMember(argument: string): GuildMember {
        if (this.commandData.message.mentions?.members?.first()) {
            return this.commandData.message.mentions?.members?.first();
        }

        const targetMemberID: string = AbstractMentionableCommand.extractID(argument);

        if (this.commandData.message.guild.members.cache.has(targetMemberID)) {
            try {
                return <GuildMember>this.commandData.message.guild.members.cache.get(targetMemberID);
            } catch (e) {
            }
        }

        return null;
    }

    protected extractTargetRole(argument: string): Role {
        if (this.commandData.message.mentions?.roles?.first()) {
            return this.commandData.message.mentions?.roles?.first();
        }

        const targetRoleID: string = AbstractMentionableCommand.extractID(argument);

        if (this.commandData.message.guild.roles.cache.has(targetRoleID)) {
            try {
                return <Role>this.commandData.message.guild.roles.cache.get(targetRoleID);
            } catch (e) {
            }
        }

        return null;
    }

    protected getDurationArgument(restArgs: string[]): { num: number, str: string } {
        let possibleDurationArgument: string = restArgs[0];

        const duration: number = TimeParser.getUnitArgsSum(possibleDurationArgument);

        if (duration !== null) {
            restArgs.shift();

            if (new RegExp(/^\d+$/).test(possibleDurationArgument)) {
                possibleDurationArgument += this.languageRecord.global.min;
            }

            return {
                num: duration,
                str: possibleDurationArgument
            };
        }

        return null;
    }

    protected clientLowRoleException(members: GuildMember[]): void {
        void this.messageService.sendSystemMessage(inlineCode(this.translate("command.run.lowClientPermissions")) + "\n" + members.join("\n"), SystemMessageType.ERROR);
    }

    protected executorLowRoleException(members: GuildMember[]): void {
        void this.messageService.sendSystemMessage(inlineCode(this.translate("command.run.lowExecutorPermissions")) + "\n" + members.join("\n"), SystemMessageType.ERROR);
    }

    protected selfActionException(): void {
        void this.messageService.sendSystemMessage(inlineCode(this.translate("command.run.selfAction")), SystemMessageType.ERROR);
    }

    protected clientActionException(): void {
        void this.messageService.sendSystemMessage(inlineCode(this.translate("command.run.clientAction")), SystemMessageType.ERROR);
    }

    protected botActionException(): void {
        void this.messageService.sendSystemMessage(inlineCode(this.translate("command.run.botAction")), SystemMessageType.ERROR);
    }

    protected ownerActionException(): void {
        void this.messageService.sendSystemMessage(inlineCode(this.translate("command.run.ownerAction")), SystemMessageType.ERROR);
    }

    public get referenceMember(): GuildMember {
        return this._referenceMember;
    }
}

type FetchType = "members" | "channels" | "roles";
