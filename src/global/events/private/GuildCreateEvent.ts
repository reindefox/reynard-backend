import { color } from "@src/assets/json/colors";
import { properties } from "@src/assets/json/properties";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { GuildModel } from "@src/database/models/Guild";
import { createErrorLog } from "@src/scripts/Logger";
import { GuildLocaleService } from "@src/services/guild/GuildLocaleService";
import { Guild, MessageEmbed, Permissions, TextChannel, User } from "discord.js";

export default class GuildCreateEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildCreate",
    };

    constructor() {
        super(GuildCreateEvent.options);
    }

    protected guildData: GuildModel = null;
    protected localeService: GuildLocaleService = null;

    public async run(guild: Guild): Promise<void> {
        if (!guild) return;

        this.guildData = await GuildDaoManager.getOrCreate(guild);
        this.localeService = new GuildLocaleService(this.guildData);

        if (guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
            const audit = await guild.fetchAuditLogs({
                limit: 1,
                type: "BOT_ADD"
            })
                .catch(e => createErrorLog(e, __filename));
            if (!audit) return;

            if ((<User>audit.entries.first().target).id === this.client.user.id) {
                const messageEmbed: MessageEmbed = this.messageEmbedBuilder(guild);

                try {
                    await audit?.entries.first().executor?.send(messageEmbed).catch(e => createErrorLog(e, __filename));
                } catch (e) {
                    const publicUpdatesChannel: TextChannel = guild.publicUpdatesChannel;
                    if (publicUpdatesChannel) {
                        await publicUpdatesChannel.send({
                            embeds: [
                                messageEmbed
                            ]
                        }).catch(e => createErrorLog(e, __filename));
                    }
                }
            }
        }
    }

    private messageEmbedBuilder(guild: Guild): MessageEmbed {
        return new MessageEmbed()
            .setColor(color.grey)
            .setAuthor(guild.name, guild.iconURL())
            .setThumbnail(this.client.user.displayAvatarURL())
            .setDescription(this.localeService.translate("misc.welcomeMessage", [
                properties.communityServer.url,
                properties.website.url]))
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL());
    }
}
