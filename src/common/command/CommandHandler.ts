import { memberNicknameMention, userMention } from "@discordjs/builders";
import { Base } from "@src/common/abstractions/Base";
import { CommandConstructor } from "@src/common/abstractions/command/interfaces/Command";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { CommandConfig, CommandConfigModel } from "@src/database/models/CommandConfig";
import { createErrorLog } from "@src/scripts/Logger";
import { GuildLocaleService } from "@src/services/guild/GuildLocaleService";
import { LocaleService } from "@src/services/guild/LocaleService";
import { CommandCoolDown, CommandCoolDownHolder } from "@src/services/holders/CommandCoolDownHolder";
import { config } from "@src/structures/Application";
import { Reynard } from "@src/structures/Reynard";
import { CommandHandlerConstructor } from "@src/common/command/CommandHandlerConstructor";
import { Message, Permissions, TextChannel } from "discord.js";
import moment from "moment";

export class CommandHandler extends Base implements CommandHandlerConstructor {
    private static readonly coolDownHolder: CommandCoolDownHolder = new CommandCoolDownHolder();

    constructor(private readonly message: Message, private readonly guildDaoManager: GuildDaoManager) {
        super();
    }

    public async register(): Promise<void> {
        let prefix: string = null;
        let isMention: boolean = false;

        if (this.message.content.startsWith(userMention(this.client.user.id)) || this.message.content.startsWith(memberNicknameMention(this.client.user.id))) {
            if (this.message.content.startsWith(userMention(this.client.user.id))) {
                prefix = userMention(this.client.user.id);
            } else if (this.message.content.startsWith(memberNicknameMention(this.client.user.id))) {
                prefix = memberNicknameMention(this.client.user.id);
            }

            isMention = true;
        }

        if (!prefix) {
            if (!this.message.guild) {
                prefix = config.clientPrefix;
            } else {
                prefix = this.guildDaoManager?.model.prefix;
            }
        }

        if (this.message.content.startsWith(prefix)) {
            let commandName: string;
            const messageArguments: string[] = this.message.content
                .trim()
                .replace(/ +(?= )/g, "") // remove multiple spaces in arguments
                .split(" ");
            let args: string[] = [];

            if (isMention) {
                if (messageArguments[1]) {
                    commandName = messageArguments[1].toLowerCase();
                    args = messageArguments.slice(2);
                }
            } else {
                commandName = messageArguments[0].slice(prefix.length).toLowerCase();
                args = messageArguments.slice(1);
            }

            const commandKey: string = CommandHandler.getCommandKey(this.guildDaoManager?.localeService, commandName);
            if (commandKey === null) {
                return;
            }

            const command: CommandConstructor = Reynard.commands.get(commandKey);

            let commandConfig: CommandConfigModel = null;

            if (command) {
                if (this.message.guild && this.guildDaoManager?.model) {
                    commandConfig = await CommandConfig.findOne({
                        where: {
                            guildID: this.message.guild.id,
                            key: command.options.name
                        }
                    });

                    if (!commandConfig) {
                        /*
                        * We can use findOrBuild() instead of findOne() if necessary:
                        * https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findOrBuild
                        */
                        commandConfig = (<Record<any, any>>CommandConfig.build()).dataValues;
                    }

                    if (commandConfig.hasOwnProperty("toggle") && !commandConfig.toggle) {
                        return;
                    }

                    if (commandConfig.hasOwnProperty("nsfwOnly") && !(<TextChannel>this.message.channel).nsfw) {
                        return;
                    }

                    // region #Blacklist

                    if (commandConfig.hasOwnProperty("ignoredChannels") && commandConfig.ignoredChannels.length > 0) {
                        if (commandConfig.ignoredChannels.includes(this.message.channel.id)) {
                            return;
                        }
                    }

                    if (commandConfig.hasOwnProperty("ignoredMembers") && commandConfig.ignoredMembers.length > 0) {
                        if (commandConfig.ignoredMembers.includes(this.message.author.id)) {
                            return;
                        }
                    }

                    if (commandConfig.hasOwnProperty("ignoredRoles") && commandConfig.ignoredRoles.length > 0) {
                        if (this.message.member.roles.cache.some(r => commandConfig.ignoredRoles.includes(r.id))) {
                            return;
                        }
                    }

                    // endregion

                    // region #Whitelist

                    if (commandConfig.hasOwnProperty("allowedChannels") && commandConfig.allowedChannels.length > 0) {
                        if (!commandConfig.allowedChannels.includes(this.message.channel.id)) {
                            return;
                        }
                    }

                    if (commandConfig.hasOwnProperty("allowedMembers") && commandConfig.allowedMembers.length > 0) {
                        if (!commandConfig.allowedMembers.includes(this.message.author.id)) {
                            return;
                        }
                    }

                    if (commandConfig.hasOwnProperty("allowedRoles") && commandConfig.allowedRoles.length > 0) {
                        if (!this.message.member.roles.cache.some(r => commandConfig.allowedRoles.includes(r.id))) {
                            return;
                        }
                    }

                    // endregion

                    if (commandConfig.hasOwnProperty("coolDown") && commandConfig.coolDown > 0) {
                        if (!(this.guildDaoManager.model.coolDownIgnoreRoot && this.message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))) {
                            const coolDownObject: CommandCoolDown = {
                                key: command.options.name,
                                guildID: this.message.guild.id,
                                userID: this.message.author.id,
                                channelID: null
                            };

                            if (CommandHandler.coolDownHolder.has(coolDownObject)) {
                                const item: CommandCoolDown = CommandHandler.coolDownHolder.get(coolDownObject);

                                if (item && item.removeAt !== null) {
                                    if (Math.floor(new Date().getTime() / 1000) < item.removeAt) {
                                        return;
                                    } else {
                                        CommandHandler.coolDownHolder.delete(item);
                                    }
                                }
                            }

                            CommandHandler.coolDownHolder.add({
                                ...coolDownObject,
                                removeAt: Number(moment().add(commandConfig.coolDown * 1000).format("X"))
                            });
                        }
                    }
                }

                (<CommandConstructor>new command({
                    message: this.message,
                    args: args,
                    command: command,
                    localeService: this.guildDaoManager?.localeService,
                    guildData: this.guildDaoManager?.model,
                    guildDaoManager: this.guildDaoManager,
                    commandConfig: commandConfig
                }, {
                    ...command.options
                }))
                    .call(this.message, args)
                    .catch(e => createErrorLog(e, __filename));
            }
        }
    }

    private static getCommandKey(localeService: GuildLocaleService, commandName: string): string {
        if (!localeService || !commandName) {
            return null;
        }

        const languageRecord: Record<any, any> = localeService.commandsLanguageRecord || Reynard.locales.command.get(LocaleService.defaultLocale);

        let commandKey: string = null;

        for (let i in languageRecord) {
            if (languageRecord.hasOwnProperty(i)) {
                if (languageRecord[i].hasOwnProperty("keys")) {
                    if (Array.isArray(languageRecord[i].keys) && languageRecord[i].keys.includes(commandName)) {
                        commandKey = i;
                        break;
                    }
                }
            }
        }

        return commandKey;
    }
}
