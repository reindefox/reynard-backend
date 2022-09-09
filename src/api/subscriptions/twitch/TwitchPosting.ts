import { TwitchService } from "@src/api/services/TwitchService";
import { BasePosting, MentionType } from "@src/api/subscriptions/BasePosting";
import { TwitchSubscription, TwitchSubscriptionModel } from "@src/database/models/TwitchSubscription";
import { Constants } from "@src/global/constants/Constants";
import { Stream, StreamData } from "@src/packages/twitchJS/interfaces/Streams";
import { createErrorLog } from "@src/scripts/Logger";
import { LocaleService } from "@src/services/guild/LocaleService";
import { ArrayUtils } from "@src/utils/ArrayUtils";
import { HexColorString, MessageEmbed, Webhook } from "discord.js";
import moment from "moment";
import { Op } from "sequelize";
import TwitchJsOptions from "twitch-js";

export class TwitchPosting extends BasePosting {
    private static readonly twitchColor: HexColorString = "#9147ff";
    private static readonly twitchUrl: string = "https://www.twitch.tv/";

    public static twitchClient: TwitchJsOptions;

    private static readonly streamingNow: string[] = [];

    constructor() {
        super();

        TwitchPosting.twitchClient = TwitchService.instance.twitchClient;
    }

    public async attachToSchedule(): Promise<void> {
        if (!TwitchPosting.twitchClient) {
            return;
        }

        const activeSubscriptions: TwitchSubscriptionModel[] = await TwitchSubscription.findAll({
            where: {
                toggle: true,
                webhookID: {
                    [Op.not]: null,
                },
                webhookToken: {
                    [Op.not]: null,
                }
            }
        });

        const idList: string[] = activeSubscriptions.map(r => r.userID);

        if (idList.length === 0) {
            return;
        }

        const chunkedIdList: string[][] = ArrayUtils.toChunkArray(idList, 100);

        const streamsListDataNested: StreamData[][] = [];

        for (const chunk of chunkedIdList) {
            const streamsList: Stream = <Stream>await TwitchPosting.twitchClient.api.get("streams", {
                search: {
                    user_id: chunk
                }
            })
                .catch(e => createErrorLog(e, __filename));

            if (!streamsList) {
                continue;
            }

            streamsListDataNested.push(streamsList.data);
        }

        if (streamsListDataNested.length === 0) {
            return;
        }

        const streamsListData: StreamData[] = streamsListDataNested.flat();

        const streamsIDList: string[] = streamsListData.map(r => r.id);
        for (const id of TwitchPosting.streamingNow) {
            if (!streamsIDList.includes(id)) {
                const index: number = TwitchPosting.streamingNow.indexOf(id);

                if (index > -1) {
                    TwitchPosting.streamingNow.splice(index, 1);
                }
            }
        }

        for (const subscription of activeSubscriptions) {
            const streamData: StreamData = streamsListData
                .find(s => s.userLogin === subscription.login);

            if (!streamData) {
                continue;
            }

            if (TwitchPosting.streamingNow.includes(streamData.id)) {
                continue;
            } else {
                TwitchPosting.streamingNow.push(streamData.id);
            }

            if (subscription.streamNameFilter.length > 0 && !subscription.streamNameFilter.includes(streamData.title)) {
                continue;
            }

            if (subscription.gameNameFilter.length > 0 && !subscription.gameNameFilter.includes(streamData.gameName)) {
                continue;
            }

            if (streamData.startedAt) {
                const startedAtMs: number = Date.parse(streamData.startedAt);

                if (!isNaN(startedAtMs)) {
                    const secondsSinceStart: number = Math.round(Number(moment().subtract(startedAtMs)) / 1000);

                    if (secondsSinceStart > 120) {
                        continue;
                    }
                }
            }

            const webHook: Webhook = await BasePosting.fetchSubscriptionWebhook(subscription.webhookID, subscription.webhookToken, subscription)
                .catch(() => null);

            if (!webHook) {
                continue;
            }

            const localeService: LocaleService = await LocaleService.getLocaleByGuildID(subscription.guildID)
                .catch(e => createErrorLog(e, __filename));

            let content: string = null;

            const messageEmbed: MessageEmbed = new MessageEmbed()
                .setColor(TwitchPosting.twitchColor)
                .setDescription(localeService.translate("subscription.twitch.live", [streamData.userName]));

            if (subscription.usePreview) {
                const thumbnailUrl: string = streamData.thumbnailUrl
                    ?.replace("{width}", "1280")
                    ?.replace("{height}", "720");

                messageEmbed.setImage(thumbnailUrl);
            }

            if (subscription.mentionType) {
                switch (subscription.mentionType) {
                    case MentionType.EVERYONE: {
                        content = Constants.everyoneRoleName;
                        break;
                    }
                    case MentionType.HERE: {
                        content = Constants.hereRoleName;
                        break;
                    }
                }
            }

            if (streamData.gameName) {
                messageEmbed.addField(localeService.languageRecord.subscription.twitch.game, streamData.gameName);
            }

            const userUrl: string = TwitchPosting.getUserUrl(streamData);

            if (userUrl !== null) {
                messageEmbed.addField(localeService.languageRecord.subscription.twitch.watchNow, localeService.translate("subscription.twitch.clickHere", [userUrl]));
            }

            await webHook.send({
                content: content,
                embeds: [
                    messageEmbed
                ]
            })
                .catch(e => createErrorLog(e, __filename));
        }
    }

    private static getUserUrl(streamData: StreamData): string {
        return streamData ? this.twitchUrl + streamData.userLogin : null;
    }
}
