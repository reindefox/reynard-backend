import { emoji } from "@src/assets/json/emoji";
import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { AbstractMentionableUserCommand } from "@src/common/abstractions/command/model/AbstractMentionableUserCommand";
import { FilesLoader } from "@src/scripts/FilesLoader";
import { createErrorLog } from "@src/scripts/Logger";
import * as Canvas from "canvas";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import * as fs from "fs";
import GIFEncoder from "gifencoder";

export default class PetPetCommand extends AbstractMentionableUserCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "petpet",
        group: "fun",
        typing: true,
        requiresDbQuery: false,
        clientPermissions: ["ATTACH_FILES"],
        memberPermissions: []
    };

    private static readonly resolution: number = 128;

    private static readonly handImages: Promise<Buffer[]> = PetPetCommand.loadHandImages();
    private static readonly canvasHandImages: Promise<Canvas.Image[]> = PetPetCommand.loadCanvasHandImages();

    private static async loadHandImages(): Promise<Buffer[]> {
        const imageBufferList: Buffer[] = [];

        const files: any[] = await FilesLoader.getFiles("src/common/command/PetPetCommand/assets/images/hand/");

        for (const file of files) {
            imageBufferList.push(fs.readFileSync("src/common/command/PetPetCommand/assets/images/hand/" + file.name));
        }

        return imageBufferList;
    }

    private static async loadCanvasHandImages(): Promise<Canvas.Image[]> {
        const gifCache: Canvas.Image[] = [];
        const handImages: Buffer[] = await this.loadHandImages();

        for (const buffer of handImages) {
            gifCache.push(await Canvas.loadImage(buffer));
        }

        return gifCache;
    }

    protected async execute(message: Message, args: string[]): Promise<void> {
        const avatarUrl: string = this.member.user.avatarURL({format: "png"}) || this.member.user.defaultAvatarURL;

        if (!avatarUrl) {
            return;
        }

        const gifEncoder: GIFEncoder = new GIFEncoder(PetPetCommand.resolution, PetPetCommand.resolution);

        gifEncoder.start();
        gifEncoder.setDelay(20);
        gifEncoder.setRepeat(0);
        gifEncoder.setTransparent(undefined);

        const avatarImage: Canvas.Image = await Canvas.loadImage(avatarUrl)
            .catch(e => createErrorLog(e, __filename));

        if (!avatarImage) {
            this.showHelp();
            return;
        }

        const canvas: Canvas.Canvas = Canvas.createCanvas(PetPetCommand.resolution, PetPetCommand.resolution);
        const ctx: Canvas.NodeCanvasRenderingContext2D = canvas.getContext("2d");

        const frames: number = (await PetPetCommand.handImages).length;

        const gifCache: Canvas.Image[] = await PetPetCommand.canvasHandImages;

        for (let i = 0; i < frames; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const j: number = i < frames / 2 ? i : frames - i;

            const width: number = 0.8 + j * 0.02;
            const height: number = 0.8 - j * 0.05;
            const offsetX: number = (1 - width) * 0.5 + 0.1;
            const offsetY: number = (1 - height) - 0.08;

            ctx.drawImage(avatarImage, PetPetCommand.resolution * offsetX, PetPetCommand.resolution * offsetY, PetPetCommand.resolution * width, PetPetCommand.resolution * height);
            ctx.drawImage(gifCache[i], 0, 0, PetPetCommand.resolution, PetPetCommand.resolution);

            gifEncoder.addFrame(ctx);
        }

        gifEncoder.finish();

        const messageEmbed: MessageEmbed = new MessageEmbed()
            .setDescription(`**${message.member.displayName}** ${emoji.foxPetPet.string} **${this.member.displayName}**`)
            .setImage("attachment://petpet.gif");

        if (message.author.id === this.member.id) {
            messageEmbed.setFooter(this.languageRecord.command.petpet.sad);
        }

        await this.messageService.sendDefaultMessage({
            embeds: [
                messageEmbed
            ],
            files: [
                new MessageAttachment(gifEncoder.out.getData(), "petpet.gif")
            ]
        });
    }
}
