import { AbstractStrictMentionableCommand } from "@src/common/abstractions/command/model/AbstractStrictMentionableCommand";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { GuildMember, Message } from "discord.js";

export abstract class AbstractMassMentionableUserCommand extends AbstractStrictMentionableCommand {
    private _members: GuildMember[] = [];
    private _userIDList: string[] = [];
    private _restArgs: string[] = null;
    private _duration: { num: number, str: string } = null;

    protected async shouldRun(message: Message, args: string[]): Promise<boolean> {
        if (!await super.shouldRun(message, args)) {
            return false;
        }

        const allMentions: string[] = AbstractStrictMentionableCommand.getAllMentions(args, (<Record<any, any>>this.options).mentionsLimit);

        if (this.referenceMember && allMentions.length === 0) {
            try {
                this._members.push(this.referenceMember);
            } catch (e) {
            }
        } else {
            this._members = this.getMentionData<GuildMember>(allMentions, "members");
            this._userIDList.push(...allMentions);

            if (this._members.length === 0 && this._userIDList.length === 0) {
                this.showHelp();
                return false;
            }
        }

        this._restArgs = args.slice(allMentions.length);
        this._duration = this.getDurationArgument(this._restArgs);

        if (this._duration !== null) {
            if (this._duration.num > AbstractMassMentionableUserCommand.maxDuration) {
                this._duration = null;
            }

            if (this._duration.num < AbstractMassMentionableUserCommand.minDuration) {
                await this.messageService.sendSystemMessage(this.translate("command.minDuration", [AbstractMassMentionableUserCommand.minDuration]), SystemMessageType.ERROR);
                return;
            }
        }

        return true;
    }

    protected get members(): GuildMember[] {
        return this._members;
    }

    protected get userIDList(): string[] {
        return this._userIDList;
    }

    protected get restArgs(): string[] {
        return this._restArgs;
    }

    protected get duration(): { num: number, str: string } {
        return this._duration;
    }
}
