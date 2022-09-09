import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { LineStringBuilder } from "@src/utils/LineStringBuilder";
import { GuildMember, Message, MessageEmbed } from "discord.js";

export default class ServerCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "server",
        group: "utilities",
        clientPermissions: [],
        memberPermissions: []
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        const messageEmbed: MessageEmbed = new MessageEmbed();

        messageEmbed.setTitle(message.guild.name);

        if (message.guild.iconURL()) {
            messageEmbed.setThumbnail(message.guild.iconURL());
        }

        const descriptionStringBuilder: LineStringBuilder = new LineStringBuilder();

        const guildOwner: GuildMember = await message.guild.fetchOwner()
            .catch(() => null);

        descriptionStringBuilder
            .addFieldLine(this.languageRecord.command.server.name, `${message.guild.name} (\`${message.guild.id}\`)`)
            .addFieldLine(this.languageRecord.command.server.owner, guildOwner
                ? `${guildOwner.toString()} (\`${guildOwner.user.tag}\`)`
                : this.languageRecord.command.server.undefined)
            .addFieldLine(this.languageRecord.command.server.modLvl, this.languageRecord.verificationLevel[message.guild.verificationLevel]
                || this.languageRecord.global.undefined)
            .addFieldLine(this.languageRecord.command.server.created, this.momentService.getUTCFormat(message.guild.createdAt.getTime(), "x"));

        messageEmbed.setDescription(descriptionStringBuilder.build());

        await this.messageService.sendEmbedMessage(messageEmbed);
    }
}
