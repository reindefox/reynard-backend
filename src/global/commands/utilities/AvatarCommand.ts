import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMentionableUserCommand } from "@src/common/abstractions/command/model/AbstractMentionableUserCommand";
import { Message, MessageEmbed } from "discord.js";

export default class AvatarCommand extends AbstractMentionableUserCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "avatar",
        group: "utilities",
        requiresDbQuery: false,
        clientPermissions: [],
        memberPermissions: []
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        const avatarFormats: string =
            `[png](${this.member.user.displayAvatarURL({format: "png", size: 1024})}) | ` +
            `[jpg](${this.member.user.displayAvatarURL({format: "jpg", size: 1024})}) | ` +
            `[gif](${this.member.user.displayAvatarURL({format: "gif", size: 1024})}) | ` +
            `[webp](${this.member.user.displayAvatarURL({format: "webp", size: 1024})})`;

        await this.messageService.sendEmbedMessage(new MessageEmbed()
            .setAuthor(this.translate("command.avatar.header", [this.member.displayName]))
            .setDescription(avatarFormats)
            .setImage(this.member.user.displayAvatarURL({size: 512}))
        );
    }
}
