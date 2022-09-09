import { messageLengthLimits } from "@src/assets/json/messageLengthLimits";
import { EmbedField, MessageEmbed } from "discord.js";

export class BaseMessageUtils {
    private static readonly reservedSize: number = 16;

    public static formatEmbedStructure(messageEmbed: MessageEmbed): void {
        if (!(messageEmbed instanceof MessageEmbed)) {
            return;
        }

        const messageEmbedData: { author: string, description: string, footer: string, title: string } =
            {
                author: messageEmbed.author?.name,
                description: messageEmbed.description,
                footer: messageEmbed.footer?.text,
                title: messageEmbed.title
            };

        for (const [key, value] of Object.entries(messageEmbedData)) {
            if (messageLengthLimits.embed.hasOwnProperty(key) && value && messageEmbed[key]) {
                if (value && value.length > messageLengthLimits.embed[key]) {
                    messageEmbedData[key] = this.cropData(messageEmbedData[key], messageLengthLimits.embed[key]);
                }
            }
        }

        if (messageEmbedData.author)
            messageEmbed.author.name = messageEmbedData.author;

        if (messageEmbedData.description)
            messageEmbed.description = messageEmbedData.description;

        if (messageEmbedData.footer)
            messageEmbed.footer.text = messageEmbedData.footer;

        if (messageEmbedData.title)
            messageEmbed.title = messageEmbedData.title;

        if (messageEmbed.fields.length > messageLengthLimits.embed.fields) {
            messageEmbed.fields.splice(0, 25);
        }

        if (messageEmbed.fields.length > 0) {
            for (const field of messageEmbed.fields) {
                if (field.name.length > messageLengthLimits.embed.fieldName) {
                    field.name = this.cropData(field.name, messageLengthLimits.embed.fieldName);
                }

                if (field.value.length > messageLengthLimits.embed.fieldValue) {
                    field.value = this.cropData(field.value, messageLengthLimits.embed.fieldValue);
                }
            }
        }

        if (messageEmbed.length > 6000) {
            let stepLength: number = 0;

            /* The order of the parameters is important as check goes top-down */
            const messageEmbedClassFields: Record<any, any> = {
                author: messageEmbed.author?.name,
                title: messageEmbed.title,
                description: messageEmbed.description,
                footer: messageEmbed.footer?.text,
            };

            for (const [key, value] of Object.entries(messageEmbedClassFields)) {
                if (!value) {
                    continue;
                }

                stepLength += value.length;

                if (stepLength > 6000) {
                    const residualValue: number = Math.max(0, Math.abs(6000 - stepLength));

                    messageEmbedClassFields[key] = residualValue === 0 ? undefined : this.cropData(value, residualValue);
                }
            }

            if (messageEmbed.fields.length > 0) {
                const fields: EmbedField[] = [];

                for (const field of messageEmbed.fields) {
                    stepLength += field.value.length + field.name.length;

                    if (stepLength > 6000) {
                        continue;
                    }

                    fields.push(field);
                }

                messageEmbed.setFields(fields);
            }

            if (messageEmbed.author && messageEmbedClassFields.author) {
                messageEmbed.setAuthor(messageEmbedClassFields.author, messageEmbed.author.iconURL, messageEmbed.author.url);
            }

            if (messageEmbed.title && messageEmbedClassFields.title) {
                messageEmbed.setTitle(messageEmbedClassFields.title);
            }

            if (messageEmbed.description && messageEmbedClassFields.description) {
                messageEmbed.setDescription(messageEmbedClassFields.description);
            }

            if (messageEmbed.footer && messageEmbedClassFields.footer) {
                messageEmbed.setFooter(messageEmbedClassFields.footer, messageEmbed.footer.iconURL);
            }
        }
    }

    public static formatBaseStructure(content: string): string {
        if (content.length > messageLengthLimits.default.content) {
            content = this.cropData(content, messageLengthLimits.default.content);
        }

        return content;
    }

    private static cropData(data: string, length: number): string {
        return data.slice(0, length - BaseMessageUtils.reservedSize) + "…";
    }
}
