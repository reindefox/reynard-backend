import { inlineCode } from "@discordjs/builders";
import { emoji } from "@src/assets/json/emoji";
import { properties } from "@src/assets/json/properties";
import { CommandConstructor, CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { CommandConfig, CommandConfigModel } from "@src/database/models/CommandConfig";
import { Reynard } from "@src/structures/Reynard";
import { Message, MessageEmbed } from "discord.js";

export default class HelpCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "help",
        group: "information",
        clientPermissions: [],
        memberPermissions: []
    };

    public static readonly groupPosition: Record<string, number> = {
        "information": 0,
        "moderation": 1,
        "utilities": 2,
        "fun": 3
    };

    private static defaultCommands: CommandConstructor[];
    private static groups: string[];

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!HelpCommand.defaultCommands) {
            HelpCommand.defaultCommands = Reynard.commands
                .filter(c => !c.options.developerOnly && c.options.group !== "development")
                .sort((a: CommandConstructor, b: CommandConstructor) =>
                    HelpCommand.groupPosition[a.options.group] - HelpCommand.groupPosition[b.options.group])
                .map(c => c);
        }

        if (!HelpCommand.groups) {
            HelpCommand.groups = [...new Set(HelpCommand.defaultCommands.map(c => c.options.group))];
        }

        const messageEmbed: MessageEmbed = new MessageEmbed();

        messageEmbed.setThumbnail(this.client.user.avatarURL() || this.client.user.defaultAvatarURL);

        if (args[0]) {
            const categoryInputName: string = args[0].toLowerCase();

            let categoryLocaleWrite: { key: string, localeKey: string } = null;

            for (const [key, value] of Object.entries(this.languageRecord.command.category)) {
                if (value.toString().toLowerCase() === categoryInputName) {
                    categoryLocaleWrite = {key: key, localeKey: value.toString()};
                }
            }

            if (!categoryLocaleWrite) {
                this.showHelp();
                return;
            }

            const filteredCommands: CommandConstructor[] = HelpCommand.defaultCommands
                .filter(c => c.options.group === categoryLocaleWrite.key)
                .sort((a: CommandConstructor, b: CommandConstructor) => a.options.name.localeCompare(b.options.name))
                .map(c => c);

            messageEmbed.setAuthor(categoryLocaleWrite.localeKey);
            messageEmbed.setDescription("");

            for (const command of filteredCommands) {
                messageEmbed.description += `**\`${this.commandData.guildData.prefix}${this.localeService.commandsLanguageRecord[command.options.name].keyName}\`**\n` +
                    `${this.languageRecord.command[command.options.name]?.description || "-"}` +
                    `\n\n`;
            }
        } else {
            const commandConfigs: CommandConfigModel[] = await CommandConfig.findAll({
                where: {
                    guildID: message.guild.id
                }
            });

            messageEmbed.setDescription(this.translate("command.getDetailedInfo", [properties.website.url,
                this.commandData.guildData.prefix + this.localeService.commandsLanguageRecord[this.options.name].keyName]));

            const filteredCommands: CommandConstructor[] = [];

            for (const defaultCommand of HelpCommand.defaultCommands) {
                const commandConfig: CommandConfigModel = commandConfigs.find(e => e.key === defaultCommand.options.name);

                if (commandConfig) {
                    if (commandConfig.hasOwnProperty("hidden") && commandConfig.hidden) {
                        return;
                    }
                }

                filteredCommands.push(defaultCommand);
            }

            for (let i in HelpCommand.groups) {
                const groupCommands: string[] = filteredCommands
                    .filter(c => c.options.group === HelpCommand.groups[i])
                    .sort((a: CommandConstructor, b: CommandConstructor) => a.options.name.localeCompare(b.options.name))
                    .map(c => inlineCode(this.localeService.commandsLanguageRecord[c.options.name].keyName));

                if (groupCommands.length > 0) {
                    const groupLocaleName: string = this.translate("command.category." + HelpCommand.groups[i]);
                    messageEmbed.addField(`${emoji.star.string} ${groupLocaleName} **[${groupCommands.length}]**`, groupCommands.join(" "));
                }
            }
        }

        await this.messageService.sendEmbedMessage(messageEmbed, true);
    }
}
