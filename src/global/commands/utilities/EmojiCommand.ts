import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMentionableCommand } from "@src/common/abstractions/command/model/AbstractMentionableCommand";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import { GuildEmoji, Message, MessageEmbed } from "discord.js";

export default class EmojiCommand extends AbstractMentionableCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "emoji",
        group: "utilities",
        clientPermissions: [],
        memberPermissions: []
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        if (!args[0]) {
            this.showHelp();
            return;
        }

        const expectedID: string = EmojiCommand.extractID(args[0].replace(/:.*:/, ""));
        const expectedEmoji: GuildEmoji = this.client.emojis.cache.get(expectedID);

        if (!expectedEmoji) {
            await this.messageService.sendSystemMessage(this.languageRecord.command.emoji.notAnEmoji, SystemMessageType.ERROR);
            return;
        }

        await this.messageService.sendEmbedMessage(new MessageEmbed()
            .setDescription(`${expectedEmoji} **\`${expectedEmoji.name}\`**\n` +
                `\`${expectedEmoji.id}\`\n` +
                `\`${expectedEmoji.toString()}\``)
            .setImage(expectedEmoji.url)
        );
    }
}
