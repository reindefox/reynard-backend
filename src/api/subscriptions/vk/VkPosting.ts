import { BasePosting } from "@src/api/subscriptions/BasePosting";
import { VkWallPostNew } from "@src/api/subscriptions/vk/types/event/VkWallPostNew";
import { VkGroupEvent } from "@src/api/subscriptions/vk/types/VkGroupEvent";
import { VkWallGet } from "@src/api/subscriptions/vk/types/VkWallGet";
import { VKSubscriptionModel } from "@src/database/models/VKSubscription";
import { LocaleService } from "@src/services/guild/LocaleService";
import { BaseMessageUtils } from "@src/common/command/service/BaseMessageUtils";
import { HexColorString, MessageEmbed } from "discord.js";
import { AttachmentType, IPhotoAttachmentPayload } from "vk-io";
import { IPhotoSize } from "vk-io/lib/structures/attachments/photo";

/* Unreleased */
export class VkPosting extends BasePosting {
    private static readonly vkUrl: string = "https://vk.com/";
    private static readonly vkColor: HexColorString = "#6896c1";
    private static readonly vkLogoURL: string = "https://i.imgur.com/uUVJadm.png";

    private readonly messageEmbed: MessageEmbed = VkPosting.createDefaultEmbedStructure();
    private readonly messageEmbeds: MessageEmbed[] = [
        this.messageEmbed
    ];

    private localeService: LocaleService;

    constructor(
        private readonly data: VkGroupEvent<VkWallPostNew>,
        private readonly vkSubscription: VKSubscriptionModel
    ) {
        super();
    }

    public async init(): Promise<void> {
        this.localeService = await LocaleService.getLocaleByGuildID(this.vkSubscription.guildID);

        if (!this.localeService) {
            return;
        }

        const vkWallGet: VkWallGet.Post = this.data.object.vkWallGet;

        if (vkWallGet.attachments?.length > 0) {
            this.parseAttachments(vkWallGet.attachments);
        }

        BaseMessageUtils.formatEmbedStructure(this.messageEmbed);
    }

    private parseAttachments(attachments: VkWallGet.WallAttachment.WallAttachment[]): void {
        const formattedAttachments: string[] = attachments.map(attachment => {
            switch (attachment.type) {
                case "photo": {
                    if (!this.messageEmbed.image) {
                        this.messageEmbed.setImage(VkPosting.getLargestPhotoSize(attachment.photo).url);
                    }

                    break;
                }
                case "video": {
                    break;
                }
                case "link": {
                    break;
                }
                case "doc": {
                    break;
                }
                case "poll": {
                    return this.localeService.translate("subscription.vk.poll", [
                        attachment.poll.question,
                        VkPosting.buildRestUrl(`?w=${AttachmentType.POLL}${attachment.poll.owner_id}_${attachment.poll.id}`)
                    ]);
                }
                case "audio": {
                    return this.localeService.translate("subscription.vk.audio", [
                        attachment.audio.artist,
                        attachment.audio.title,
                        VkPosting.buildRestUrl(`${AttachmentType.AUDIO}${attachment.audio.owner_id}_${attachment.audio.id}`)
                    ]);
                }
                case "album": {
                    return this.localeService.translate("subscription.vk.album", [
                        attachment.album.title,
                        VkPosting.buildRestUrl(`${AttachmentType.ALBUM}${attachment.audio.owner_id}_${attachment.audio.id}`)
                    ]);
                }
                case "market": {
                    return this.localeService.translate("subscription.vk.market", [
                        attachment.market.title,
                        VkPosting.buildRestUrl(`${AttachmentType.MARKET}${attachment.market.owner_id}?w=product${attachment.market.owner_id}_${attachment.market.id}`)
                    ]);
                }
                case "market_album": {
                    return this.localeService.translate("subscription.vk.marketAlbum", [
                        attachment.market_album.title,
                        VkPosting.buildRestUrl(`${AttachmentType.MARKET}${attachment.market_album.owner_id}?section=${AttachmentType.ALBUM}_${attachment.market_album.id}`)
                    ]);
                }
                default: {
                    return "";
                }
            }
        });
    }

    private static buildRestUrl(data: string): string {
        return this.vkUrl + data;
    }

    private static createDefaultEmbedStructure(): MessageEmbed {
        return new MessageEmbed()
            .setColor(VkPosting.vkColor);
    }

    private static getLargestPhotoSize(photo: IPhotoAttachmentPayload): IPhotoSize {
        return photo.sizes
            .sort((a, b) => b.height - a.height || b.width - a.width)
            .pop();
    }
}
