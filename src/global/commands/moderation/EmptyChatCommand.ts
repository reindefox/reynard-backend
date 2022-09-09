import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { Message } from "discord.js";
import sample from "lodash/sample";

export default class EmptyChatCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "emptychat",
        group: "moderation",
        memberPermissions: ["MANAGE_MESSAGES"],
        clientPermissions: [],
        ignoreMentionGuildRule: true,
    };

    private static readonly responseVariations: string[] = [
        "*Poof...*",
        "*tada...*",
        "Yip!",
        "<:foxlicking:854812846051426355>",
        ":magic_wand:",
    ];

    private static readonly defaultRepeatSize: number = 500;

    protected async execute(message: Message, args: string[]): Promise<void> {
        const newLineString: string = sample(EmptyChatCommand.responseVariations) + String("\n** **").repeat(EmptyChatCommand.defaultRepeatSize);

        await this.messageService.sendContentMessage(newLineString);
    }
}
