import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import axios from "axios";
import { Message, MessageEmbed } from "discord.js";

export default class FoxCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "fox",
        group: "fun",
        typing: true,
        clientPermissions: [],
        memberPermissions: []
    };

    public static readonly slashCommandBuilder: SlashCommandBuilder = this.getDefaultSlashCommandBuilder(this.options);

    public static readonly apiUrl: string = "https://randomfox.ca/floof/";

    protected async execute(message: Message, args: string[]): Promise<void> {
        const apiResponse: FoxApiResponse = (await axios.get(FoxCommand.apiUrl)
            .catch(() => null))?.data;

        if (!apiResponse) {
            await this.messageService.sendErrorMessage();
            return;
        }

        await this.messageService.sendEmbedMessage(new MessageEmbed()
            .setImage(apiResponse.image)
        );
    }
}

interface FoxApiResponse {
    image: string;
    link: string;
}
