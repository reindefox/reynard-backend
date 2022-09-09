import { AbstractMentionableCommand } from "@src/common/abstractions/command/model/AbstractMentionableCommand";
import { UserDaoManager } from "@src/database/dao/managers/UserDaoManager";
import { UserModel } from "@src/database/models/User";
import { GuildMember, Message } from "discord.js";

export abstract class AbstractMentionableUserCommand extends AbstractMentionableCommand {
    private _targetMember: GuildMember = null;
    private _targetMemberData: UserModel = null;
    private _restArgs: string[] = null;

    protected async shouldRun(message: Message, args: string[]): Promise<boolean> {
        if (!await super.shouldRun(message, args)) {
            return;
        }

        if (!await this.includesMentions(message, args)) {
            this._targetMember = message.member;
        } else {
            let firstMentioned: GuildMember;

            if (this.referenceMember) {
                firstMentioned = this.referenceMember;
            } else {
                const allMentions: string[] = AbstractMentionableCommand.getAllMentions(args);

                if (allMentions.length === 0) {
                    this.showHelp();
                    return false;
                }

                firstMentioned = message.guild.members.cache.get(allMentions[0]);
            }

            if (!firstMentioned) {
                firstMentioned = message.member;
            }

            this._targetMember = firstMentioned;
        }

        this._restArgs = args.slice(1);

        if (this.options.selfMention === false && message.author.id === this._targetMember.id) {
            return false;
        }

        if ((<Record<any, any>>this.options).disableBots && this._targetMember.user.bot) {
            this.botActionException();
            return false;
        }

        if ((<Record<any, any>>this.options).requiresDbQuery !== false) {
            this._targetMemberData = await UserDaoManager.get(this._targetMember.user);
        }

        return true;
    }

    protected get member(): GuildMember {
        return this._targetMember;
    }

    protected get targetMember(): UserModel {
        return this._targetMemberData;
    }

    protected get restArgs(): string[] {
        return this._restArgs;
    }
}
