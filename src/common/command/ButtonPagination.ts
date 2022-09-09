import { emoji } from "@src/assets/json/emoji";
import { AbstractCommand } from "@src/common/abstractions/command/model/AbstractCommand";
import { ArrayUtils } from "@src/utils/ArrayUtils";
import { NumberFormatUtils } from "@src/utils/NumberFormatUtils";
import { SystemMessageType } from "@src/common/command/service/MessageService";
import {
    Collection,
    Constants,
    EmojiIdentifierResolvable,
    GuildMember, Interaction,
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageButton,
    MessageCollector,
    MessageComponentInteraction,
    MessageEmbed,
    MessageEmbedOptions,
    Snowflake
} from "discord.js";

export abstract class ButtonPagination<T> {
    private static readonly maxTimeout: number = 300000;
    private static readonly redirectMaxTimeout: number = 10000;

    protected chunkedData: T[][];

    protected pages: number = 0;
    protected readonly interactionExecutor: GuildMember;
    protected pageNumber: number = 1;

    protected readonly previousButton: MessageButton = ButtonPagination.createButton("previous", emoji.leftArrow.string);
    protected readonly nextButton: MessageButton = ButtonPagination.createButton("next", emoji.rightArrow.string);
    protected readonly redirectButton: MessageButton = ButtonPagination.createButton("redirect", emoji.cursor.string);
    protected readonly deleteButton: MessageButton = ButtonPagination.createButton("delete", emoji.redCross.string);

    private waitingForAnswer: boolean = false;

    constructor(
        protected data: T[],
        protected readonly command: AbstractCommand,
        protected readonly defaultMessageEmbedStructure: MessageEmbedOptions,
        protected readonly elementsPerPage: number = 10,
        protected readonly startPage: number = 1,
        protected readonly numerateElements: boolean = false,
    ) {
        this.setData(data);

        this.pageNumber = startPage;
        this.interactionExecutor = command.commandData.message.member;
    }

    public setData(data: T[]): void {
        this.data = data;
        this.pages = Math.ceil(data.length / this.elementsPerPage);
        this.chunkedData = ArrayUtils.toChunkArray(data, this.elementsPerPage);
    }

    public async createPaginationComponent(): Promise<Message | Message[]> {
        const paginationMessage: Message = <Message>await this.command.messageService.sendDefaultMessage({
            embeds: [
                this.getCurrentPageEmbed()
            ],
            components: [
                new MessageActionRow()
                    .addComponents(this.createButtons())
            ]
        })
            .catch(() => null);

        if (!paginationMessage) {
            return;
        }

        const collector: InteractionCollector<Interaction> = paginationMessage.createMessageComponentCollector({
            filter: e => this.getButtonsAsList()
                .map(b => b.customId)
                .includes((<MessageButton><unknown>e).customId),
            time: ButtonPagination.maxTimeout
        });

        collector.on("collect", async (interaction: MessageComponentInteraction) => {
            if (!interaction || !interaction.message) {
                return;
            }

            if (interaction.user.id !== this.interactionExecutor.id) {
                await interaction.deferUpdate();

                await interaction.reply({
                    embeds: [
                        this.command.messageService.prepareSystemMessage(this.command.languageRecord.rest.interactionExecutorError, SystemMessageType.ERROR),
                    ],
                    ephemeral: true
                });

                return;
            }

            switch (<PaginationButtonCustomID>interaction.customId) {
                case "previous": {
                    await this.previousInteractionPage(interaction);

                    break;
                }
                case "next": {
                    await this.nextInteractionPage(interaction);

                    break;
                }
                case "redirect": {
                    if (this.waitingForAnswer) {
                        return;
                    }

                    if (interaction.message instanceof Message) {
                        const redirectMessage: Message = await interaction.message.reply({
                            content: this.interactionExecutor.toString(),
                            embeds: [
                                this.command.messageService.prepareSystemMessage(this.command.languageRecord.rest.inputPageNumber, SystemMessageType.WAIT_ANS)
                                    .setFooter(this.command.languageRecord.rest.inputPageWarning)
                            ],
                            allowedMentions: {
                                repliedUser: false
                            }
                        })
                            .catch(() => null);

                        if (!redirectMessage) {
                            return;
                        }

                        setTimeout(() => {
                            redirectMessage.delete()
                                .catch(() => null);
                        }, 5000);

                        const pageNumberCollector: MessageCollector = interaction.message.channel.createMessageCollector({
                            filter: e => e.member.id === this.interactionExecutor.id,
                            time: ButtonPagination.redirectMaxTimeout
                        });

                        this.waitingForAnswer = true;

                        pageNumberCollector.once("collect", (message: Message) => {
                            const page: number = NumberFormatUtils.parseInt(message.content?.trim());

                            if (page) {
                                this.setInteractionPageNumber(page, interaction)
                                    .catch(() => {
                                        this.setPageNumber(<Message>interaction.message, page);
                                    });
                            } else {
                                interaction.deferUpdate();
                            }

                            redirectMessage.delete()
                                .catch(() => null);

                            message.delete()
                                .catch(() => null);

                            this.waitingForAnswer = false;
                        });

                        pageNumberCollector.on("end", (collected: Collection<Snowflake, Message>, reason: string) => {
                            this.waitingForAnswer = false;
                        });
                    }

                    break;
                }
                case "delete": {
                    await interaction.deferUpdate();

                    await interaction.deleteReply()
                        .catch(() => null);

                    break;
                }
                default: {
                    break;
                }
            }

            collector.resetTimer();
        });

        collector.on("end", (collected: Collection<Snowflake, MessageComponentInteraction>, reason: string) => {
            if (reason === "messageDelete") {
                return;
            }

            this.disableAllButtons();

            const currentPageEmbed: MessageEmbed = this.getCurrentPageEmbed();

            if (currentPageEmbed.footer) {
                currentPageEmbed.setFooter(`${currentPageEmbed.footer} • ${this.command.languageRecord.rest.interactionTimeout}`, "https://i.imgur.com/N54ISrx.png");
            } else {
                currentPageEmbed.setFooter(this.command.languageRecord.rest.interactionTimeout, "https://i.imgur.com/N54ISrx.png");
            }

            paginationMessage.edit({
                embeds: [
                    currentPageEmbed
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(this.getButtonsAsList())
                ]
            })
                .catch(() => null);
        });

        return paginationMessage;
    }

    public async previousInteractionPage(interaction: MessageComponentInteraction): Promise<void> {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            await this.updateInteractionPage(interaction);
        }
    }

    public async nextInteractionPage(interaction: MessageComponentInteraction): Promise<void> {
        if (this.pageNumber < this.chunkedData.length) {
            this.pageNumber++;
            await this.updateInteractionPage(interaction);
        }
    }

    public async setInteractionPageNumber(page: number, interaction: MessageComponentInteraction): Promise<void> {
        if (page < 1) {
            page = 1;
        } else if (page > this.chunkedData.length) {
            page = this.chunkedData.length;
        }

        this.pageNumber = page;
        await this.updateInteractionPage(interaction);
    }

    public async setPageNumber(message: Message, page: number): Promise<void> {
        if (page < 1) {
            page = 1;
        } else if (page > this.chunkedData.length) {
            page = this.chunkedData.length;
        }

        this.pageNumber = page;
        await this.updatePage(message);
    }

    private async updatePage(message: Message): Promise<Message> {
        this.checkDirectionButtons();

        return message.edit({
            embeds: [
                this.getCurrentPageEmbed()
            ],
            components: [
                new MessageActionRow()
                    .addComponents(this.createButtons())
            ]
        });
    }

    private async updateInteractionPage(interaction: MessageComponentInteraction): Promise<void> {
        this.checkDirectionButtons();

        await interaction.deferUpdate();

        await interaction.editReply({
            embeds: [
                this.getCurrentPageEmbed()
            ],
            components: [
                new MessageActionRow()
                    .addComponents(this.createButtons())
            ]
        });
    }

    public checkDirectionButtons(): void {
        /* Disable previous page button if it's first page */
        this.previousButton.setDisabled(this.pageNumber <= 1);
        /* Disable next page button if it's last page */
        this.nextButton.setDisabled(this.pageNumber >= this.pages);
        /* Disable custom page button if there are no pages or there's only one page */
        this.redirectButton.setDisabled(this.pages <= 1);
    }

    private getCurrentPageEmbed(): MessageEmbed {
        const messageEmbed: MessageEmbed = new MessageEmbed(this.defaultMessageEmbedStructure);

        if (this.data.length > 0) {
            if (messageEmbed.description) {
                messageEmbed.description += "\n\n";
            } else {
                messageEmbed.setDescription("");
            }

            const dataPage: T[] = this.chunkedData[this.pageNumber - 1];

            let elementsCounter: number = (this.pageNumber - 1) * this.elementsPerPage;

            for (const data of dataPage) {
                elementsCounter++;

                if (this.numerateElements) {
                    messageEmbed.description += `**${elementsCounter}.** `;
                }

                this.createPageElement(
                    data,
                    messageEmbed,
                );

                messageEmbed.description += "\n** **\n";
            }

            messageEmbed.setFooter(`${this.command.languageRecord.rest.page} ${this.pageNumber} / ${this.pages}`);
        } else {
            messageEmbed.setDescription(this.command.languageRecord.rest.notFound);
        }

        return messageEmbed;
    }

    private createButtons(): MessageButton[] {
        this.checkDirectionButtons();

        return this.getButtonsAsList();
    }

    private getButtonsAsList(): MessageButton[] {
        return [
            this.previousButton,
            this.nextButton,
            this.redirectButton,
            this.deleteButton
        ];
    }

    private disableAllButtons(): void {
        this.getButtonsAsList().forEach((button: MessageButton) => {
            button.setDisabled(true);
        });
    }

    private static createButton(customId: PaginationButtonCustomID, emoji: EmojiIdentifierResolvable): MessageButton {
        return new MessageButton()
            .setCustomId(customId)
            .setEmoji(emoji)
            .setStyle(Constants.MessageButtonStyles.SECONDARY);
    }

    protected abstract createPageElement(data: T, messageEmbed: MessageEmbed): void;
}

export type PaginationButtonCustomID =
    "previous"
    | "next"
    | "redirect"
    | "delete"
