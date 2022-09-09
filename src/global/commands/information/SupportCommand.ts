import { properties } from "@src/assets/json/properties";
import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { Message } from "discord.js";

export default class SupportCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "support",
        group: "information",
        clientPermissions: [],
        memberPermissions: []
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        await this.messageService.sendContentMessage(properties.communityServer.url);
    }
}
