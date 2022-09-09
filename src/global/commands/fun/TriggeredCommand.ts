import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { createErrorLog } from "@src/scripts/Logger";
import { NumberFormatUtils } from "@src/utils/NumberFormatUtils";
import { StringUtils } from "@src/utils/StringUtils";
import axios, { AxiosResponse } from "axios";
import * as Canvas from "canvas";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import * as fs from "fs";
import GIFEncoder from "gifencoder";

export default class TriggeredCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "triggered",
        group: "fun",
        typing: true,
        clientPermissions: ["ATTACH_FILES"],
        memberPermissions: []
    };

    public static readonly allowedImageDomains: string[] = [
        "i.imgur.com",
        "cdn.discordapp.com"
    ];

    public static readonly allowedImageExtensions: string[] = [
        "png",
        "jpg",
        "jpeg"
    ];

    private static readonly frames: number = 5;

    private static readonly triggeredTemplate: Buffer = fs.readFileSync("src/common/command/TriggeredCommand/assets/images/triggeredtemplate.png");

    public static readonly maxImageSize: { width: number, height: number } = {
        width: 2560,
        height: 1440
    };

    public static readonly maxImageFileByteLength: number = 8 * 1024 * 1024;

    protected async execute(message: Message, args: string[]): Promise<void> {
        let imageUrl: string = null;

        let attachmentType: AttachmentType;

        if (args[0]) {
            imageUrl = args[0];

            attachmentType = AttachmentType.URL;
        } else if (message.attachments?.first()) {
            if (message.attachments.first().size > TriggeredCommand.maxImageFileByteLength) {
                this.showHelp();
                return;
            }

            imageUrl = message.attachments.first().url;

            attachmentType = AttachmentType.SRC;
        }

        if (!imageUrl) {
            this.showHelp();
            return;
        }

        if (!TriggeredCommand.allowedImageDomains.includes(StringUtils.getDomainName(imageUrl))) {
            this.showHelp();
            return;
        }

        if (!TriggeredCommand.allowedImageExtensions.includes(StringUtils.getFileExtension(imageUrl))) {
            this.showHelp();
            return;
        }

        switch (attachmentType) {
            case AttachmentType.URL: {
                const response: AxiosResponse = await axios.get(imageUrl)
                    .catch(() => null);

                if (response) {
                    let contentLength: number = -1;

                    try {
                        switch (true) {
                            case response.headers.hasOwnProperty("content-length"): {
                                contentLength = Number(response.headers["content-length"]);
                                break;
                            }
                            /* For Discord API */
                            case response.headers.hasOwnProperty("x-goog-stored-content-length"): {
                                contentLength = Number(response.headers["x-goog-stored-content-length"]);
                                break;
                            }
                        }
                    } catch (e) {
                    }

                    if (contentLength !== -1 && contentLength > TriggeredCommand.maxImageFileByteLength) {
                        this.showHelp();
                        return;
                    }
                }

                break;
            }
        }

        const image: Canvas.Image = await Canvas.loadImage(imageUrl)
            .catch(e => createErrorLog(e, __filename));

        if (!image) {
            this.showHelp();
            return;
        }

        if (image.width > TriggeredCommand.maxImageSize.width || image.height > TriggeredCommand.maxImageSize.height) {
            this.showHelp();
            return;
        }

        const canvas: Canvas.Canvas = Canvas.createCanvas(image.width, image.height);

        const ctx: Canvas.NodeCanvasRenderingContext2D = canvas.getContext("2d");

        const triggeredTemplateImage: Canvas.Image = await Canvas.loadImage(TriggeredCommand.triggeredTemplate);

        const gifEncoder: GIFEncoder = new GIFEncoder(image.width, image.height);

        gifEncoder.start();
        gifEncoder.setDelay(20);
        gifEncoder.setRepeat(0);
        gifEncoder.setTransparent(undefined);

        for (let i = 0; i < TriggeredCommand.frames; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const templateHeight: number = image.height / 6;
            const shakeCoefficient: number = Math.floor(NumberFormatUtils.toChunk(image.height, 256).length) || 1;

            ctx.drawImage(image, 0, 0, image.width, image.height);
            ctx.translate(Math.random() * 2, Math.random() * 2 * shakeCoefficient);
            ctx.drawImage(triggeredTemplateImage, 0, image.height - templateHeight, image.width, templateHeight);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(Math.random() * 1.8, Math.random() * 1.8 * shakeCoefficient);
            // Add red color to image, uncomment if necessary
            // ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            // ctx.fillRect(0, 0, image.width, image.height);
            // ctx.restore();

            gifEncoder.addFrame(ctx);
        }

        gifEncoder.finish();

        await this.messageService.sendDefaultMessage({
            embeds: [
                new MessageEmbed()
                    .setImage("attachment://triggered.gif")
            ],
            files: [
                new MessageAttachment(gifEncoder.out.getData(), "triggered.gif")
            ]
        });
    }
}

export enum AttachmentType {
    SRC,
    URL
}
