import { SlashCommandBuilder } from "@discordjs/builders";
import { emoji } from "@src/assets/json/emoji";
import { properties } from "@src/assets/json/properties";
import en from "@src/assets/lang/en/en";
import { Base } from "@src/common/abstractions/Base";
import {
    AbstractCommandConstructor,
    CommandData,
    CommandOptions
} from "@src/common/abstractions/command/interfaces/Command";
import { createErrorLog } from "@src/scripts/Logger";
import { AbstractLocaleService } from "@src/services/abstract/AbstractLocaleService";
import { MomentService } from "@src/services/guild/MomentService";
import { CommandExecutionCoolDownHolder, CommandWrite } from "@src/services/holders/CommandExecutionCoolDownHolder";
import { TimeParser } from "@src/utils/TimeParser";
import { HelpMessageBuilder } from "@src/common/command/HelpMessageBuilder";
import { MessageService, SystemMessageType } from "@src/common/command/service/MessageService";
import { Interaction, Message, PermissionResolvable, Permissions, TextChannel } from "discord.js";
import moment from "moment";

export abstract class AbstractCommand extends Base implements AbstractCommandConstructor {
    public readonly messageService: MessageService;
    public readonly momentService: MomentService;
    public readonly moment: typeof moment;

    public constructor(public readonly commandData: CommandData, public readonly options: CommandOptions) {
        super();

        this.messageService = new MessageService(this.commandData);
        this.momentService = new MomentService(this.commandData.localeService?.currentLocale);
        this.moment = this.momentService.moment;
    }

    private static readonly commandCoolDownService: CommandExecutionCoolDownHolder = new CommandExecutionCoolDownHolder();

    public static readonly requiredClientPermissions: PermissionResolvable[] = [
        Permissions.FLAGS.SEND_MESSAGES
    ];

    public static readonly options: CommandOptions = <CommandOptions>{
        name: "command.keyword.none",
        group: "command.keyword.none",
        description: "command.keyword.none",
        usage: "command.keyword.none",
        /* If command is available only on the guild */
        guildOnly: true,
        /* If command is available only in the dm */
        dmOnly: false,
        /* If command is available only for developer */
        developerOnly: false,
        /* If command is available only for guild owner */
        ownerOnly: false,
        /* If command is available only in the NSFW channels */
        nsfwOnly: false,
        /* Permission required from the member to execute a command */
        memberPermissions: [],
        /* If every listed in 'memberPermissions' permission is required from member to execute a command */
        memberEveryPermission: true,
        /* Emulate client typing while executing a command */
        typing: false,
        /* If members can execute a command on themselves */
        selfMention: true,
        /* If there's no need to mention member in reply */
        ignoreMentionGuildRule: false
    };

    public static readonly maxDuration: number = 10 * TimeParser.unit.year;
    public static readonly minDuration: number = TimeParser.unit.minute;

    public async call(message: Message, args: string[], ...data: unknown[]): Promise<void> {
        if (args[0]) {
            if (args[0] === "?") {
                this.showHelp();
                return;
            }
        }

        if (this.canExecute()) {
            await this.run(message, args, ...data);
        }
    }

    public async callInteraction(interaction: Interaction): Promise<void> {

    }

    protected async run(message: Message, args: string[], ...data: unknown[]): Promise<void> {
        if (await this.shouldRun(message, args, ...data)) {
            const write: CommandWrite = {
                commandName: this.options.name,
                guildID: this.commandData.message.guild.id,
                channelID: this.commandData.message.channel.id,
                userID: this.commandData.message.author.id,
            };

            if (AbstractCommand.commandCoolDownService.has(write)) {
                this.showCoolDownCommandException();
                return;
            }

            AbstractCommand.commandCoolDownService.add(write);

            if (this.options.typing) {
                message.channel.sendTyping()
                    .catch(() => null);
            }

            await this.execute(message, args, ...data)
                .catch(e => {
                    createErrorLog(e, __filename);

                    this.messageService.sendErrorMessage();
                });

            AbstractCommand.commandCoolDownService.delete(write);
        }
    }

    private canExecute(): boolean {
        if (this.options.guildOnly && !this.commandData.message.guild) {
            return false;
        }

        if (this.options.dmOnly && this.commandData.message.guild) {
            return false;
        }

        if (this.options.developerOnly && this.commandData.message.author.id !== properties.developer.id) {
            return false;
        }

        if (this.options.nsfwOnly && !(<TextChannel>this.commandData.message.channel).nsfw) {
            return false;
        }

        if (this.commandData.message.guild) {
            if (this.options.memberPermissions.length > 0) {
                if (this.options.memberEveryPermission) {
                    if (!this.options.memberPermissions.every(p => this.commandData.message.member.permissions.has(p))) {
                        return false;
                    }
                } else {
                    if (!this.options.memberPermissions.some(p => this.commandData.message.member.permissions.has(p))) {
                        return false;
                    }
                }
            }

            if (!AbstractCommand.requiredClientPermissions.every(p => this.commandData.message.guild.me.permissions.has(p))
                || !this.options.clientPermissions.every(p => this.commandData.message.guild.me.permissions.has(p))) {
                if (this.commandData.message.guild.me.permissions.has("SEND_MESSAGES")) {
                    return false;
                }

                let requiredPermissions: string = "";

                for (const permission of this.commandData.command.options.clientPermissions.concat(AbstractCommand.requiredClientPermissions)) {
                    if (this.languageRecord.permission[<string>permission]) {
                        requiredPermissions += `\`${this.languageRecord.permission[<string>permission]}\`\n`;
                    }
                }

                if (requiredPermissions.length > 0) {
                    void this.messageService.sendSystemMessage(this.languageRecord.command.clientPermissions + "\n" + requiredPermissions, SystemMessageType.ERROR)
                        .catch(() => null);
                }

                return false;
            }
        }

        return true;
    }

    public get localeService(): AbstractLocaleService {
        return this.commandData.localeService;
    }

    public get languageRecord(): Record<any, any> {
        return this.localeService.languageRecord;
    }

    public translate(properties: string, args?: any[]): string {
        return this.commandData.localeService.translate(properties, args);
    }

    protected showHelp(): void {
        void new HelpMessageBuilder(this).sendHelpMessage();
    }

    protected showCoolDownCommandException(): void {
        void this.commandData.message.react(emoji.sandClock.cache).catch(e => createErrorLog(e, __filename));
    }

    protected getLocaleFlag<T extends string>(argument: string): T {
        if (!argument) {
            return null;
        }

        const commandFlags: Record<string, string[]> = this.localeService.commandsLanguageRecord[this.options.name]?.flags;

        if (!commandFlags) {
            console.log(`* ${this.options.name} command flags not found`);
            return null;
        }

        for (const [key, value] of Object.entries(commandFlags)) {
            if (value.includes(argument)) {
                return <T>key;
            }
        }

        return null;
    }

    protected static getDefaultSlashCommandBuilder(options: CommandOptions): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName(options.name)
            .setDescription(en.command[options.name]?.description);
    }

    protected abstract execute(message: Message, args: string[], ...data: unknown[]): Promise<void>;

    protected abstract shouldRun(message: Message, args: string[], ...data: unknown[]): Promise<boolean>;
}
