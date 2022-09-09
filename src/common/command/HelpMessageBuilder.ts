import { inlineCode } from "@discordjs/builders";
import { emoji } from "@src/assets/json/emoji";
import { AbstractCommand } from "@src/common/abstractions/command/model/AbstractCommand";
import { config } from "@src/structures/Application";
import { Message, MessageEmbed } from "discord.js";

export class HelpMessageBuilder {
    private readonly _messageEmbed: MessageEmbed = new MessageEmbed();

    private readonly commandLocale: Record<any, any>;
    private readonly commandData: Record<any, any>;

    private exampleNumber: number = 1;

    constructor(protected readonly AbstractCommandConstructor: AbstractCommand) {
        this.commandLocale = this.AbstractCommandConstructor.localeService.commandsLanguageRecord[this.AbstractCommandConstructor.options.name];
        this.commandData = this.AbstractCommandConstructor.localeService.languageRecord.command[this.AbstractCommandConstructor.options.name];

        if (!this.commandLocale || !this.commandData) {
            void this.AbstractCommandConstructor.messageService.sendErrorMessage("Help reference doesn't exist for this command.");

            return;
        }

        this._messageEmbed.setAuthor(`${this.AbstractCommandConstructor.translate("command.keyword.name")} — "${this.commandLocale.keyName}"`);
        this._messageEmbed.setDescription(this.commandData.description);
        this._messageEmbed.addField(this.AbstractCommandConstructor.translate("command.keyword.usage"), this.getCodeString(this.commandData.usage));

        if (this.commandLocale.keys.length > 1) {
            this._messageEmbed.addField(this.AbstractCommandConstructor.translate("command.keyword.aliases"), this.commandLocale.keys
                .filter(c => c !== this.commandLocale?.keyName)
                .map(c => inlineCode(`${this.AbstractCommandConstructor.commandData.guildData.prefix || config.clientPrefix}${c}`))
                .join(" "));
        }

        const examples: {
            usage: string,
            description: string
        }[] = this.commandData.example || [];

        for (const example of examples) {
            this.addExample(example.usage, example.description);
        }
    }

    public addExample(usage: string, description: string): void {
        let exampleContent = this.getCodeString(usage);

        if (description && description.length > 0) {
            exampleContent += `\n${description}`;
        }

        this._messageEmbed.addField(`${this.AbstractCommandConstructor.translate("command.example")} ${this.exampleNumber}`, exampleContent);

        this.exampleNumber++;
    }

    private getCodeString(data: string): string {
        if (data && data.length > 0) {
            return inlineCode(`${this.AbstractCommandConstructor.commandData.guildData.prefix || config.clientPrefix}${this.commandLocale.keyName} ${data}`);
        } else {
            return inlineCode(`${this.AbstractCommandConstructor.commandData.guildData.prefix || config.clientPrefix}${this.commandLocale.keyName}`);
        }
    }

    public get messageEmbed(): MessageEmbed {
        return this._messageEmbed;
    }

    public async sendHelpMessage(): Promise<Message | Message[]> {
        if (this.commandData.description === null || this.commandData.usage === null) {
            console.log(`"${this.commandLocale.keyName}" command help reference doesn't exist`);
            await this.AbstractCommandConstructor.messageService.sendErrorMessage();
            return null;
        }

        return this.AbstractCommandConstructor.messageService.sendEmbedMessage(this._messageEmbed, true);
    }
}
