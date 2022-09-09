import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LineType } from "@src/modules/logging/utils/LogLineStringBuilder";
import { GuildAuditLogs, GuildChannel, TextChannel, VoiceChannel } from "discord.js";

export default class LogChannelUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "channelUpdate",
        name: "event.channelUpdate.name"
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogChannelUpdate.options, guildDaoManager);
    }

    protected async execute(oldChannel: GuildChannel, newChannel: GuildChannel): Promise<void> {
        if (JSON.stringify(newChannel.permissionOverwrites.cache) !== JSON.stringify(oldChannel.permissionOverwrites.cache)) {
            return;
        }

        const audit: GuildAuditLogs = await this.fetchAuditLogs(newChannel.guild, "CHANNEL_UPDATE");

        if (!this.canContinueExecution(newChannel, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.blue)
            .setAuthor(this.translate("eventLogger.channelUpdate.name"), icons.channelUpdate)
            .setDescription(this.translate("eventLogger.channelUpdate.description"));

        this.messageBuilder.addField(this.translate("eventLogger.keyword.channel"), this.logStringBuilder
            .addFieldLine(this.translate("eventLogger.keyword.channel"), newChannel, false)
            .addFieldLine("ID", newChannel.id)
            .addFieldLine(this.translate("eventLogger.keyword.name"), newChannel.name)
            .addFieldLine(this.translate("eventLogger.keyword.type"), newChannel.type)
            .addFieldLine(this.translate("eventLogger.keyword.position"), newChannel.position)
            .build());

        this.messageBuilder.setEventExecutor(audit);

        if (newChannel.name !== oldChannel.name) {
            this.messageBuilder.addField(this.translate("eventLogger.channelUpdate.name"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newChannel.name)
                .addFieldLineProperty(LineType.OLD, oldChannel.name)
                .build());
        }

        switch (newChannel.type) {
            case "GUILD_TEXT": {
                const newTextChannel = <TextChannel>newChannel;
                const oldTextChannel = <TextChannel>oldChannel;

                if (newTextChannel.topic !== oldTextChannel.topic) {
                    this.messageBuilder.addField(this.translate("eventLogger.channelUpdate.topic"), this.logStringBuilder
                        .addFieldLineProperty(LineType.NEW, newTextChannel.topic)
                        .addFieldLineProperty(LineType.OLD, oldTextChannel.topic)
                        .build());
                }
                if (newTextChannel.nsfw !== oldTextChannel.nsfw) {
                    this.messageBuilder.addField(this.translate("eventLogger.channelUpdate.nsfw"), this.logStringBuilder
                        .addFieldLineProperty(LineType.NEW, this.translate("global." + newTextChannel.nsfw))
                        .addFieldLineProperty(LineType.OLD, this.translate("global." + oldTextChannel.nsfw))
                        .build());
                }
                if (newTextChannel.rateLimitPerUser !== oldTextChannel.rateLimitPerUser) {
                    this.messageBuilder.addField(this.translate("eventLogger.channelUpdate.coolDown"), this.logStringBuilder
                        .addFieldLineProperty(LineType.NEW, newTextChannel.rateLimitPerUser + " " + this.translate("global.min"))
                        .addFieldLineProperty(LineType.OLD, oldTextChannel.rateLimitPerUser + " " + this.translate("global.min"))
                        .build());
                }
                break;
            }
            case "GUILD_VOICE": {
                const newVoiceChannel: VoiceChannel = <VoiceChannel>newChannel;
                const oldVoiceChannel: VoiceChannel = <VoiceChannel>oldChannel;
                if (newVoiceChannel.bitrate !== oldVoiceChannel.bitrate) {
                    this.messageBuilder.addField(this.translate("eventLogger.channelUpdate.bitrate"), this.logStringBuilder
                        .addFieldLineProperty(LineType.NEW, newVoiceChannel.bitrate / 1000 + " " + this.translate("global.kbps"))
                        .addFieldLineProperty(LineType.OLD, newVoiceChannel.bitrate / 1000 + " " + this.translate("global.kbps"))
                        .build());
                }
                if (newVoiceChannel.userLimit !== oldVoiceChannel.userLimit) {
                    this.messageBuilder.addField(this.translate("eventLogger.channelUpdate.userLimit"), this.logStringBuilder
                        .addFieldLineProperty(LineType.NEW, newVoiceChannel.userLimit !== 0 ? newVoiceChannel.userLimit : "∞")
                        .addFieldLineProperty(LineType.OLD, oldVoiceChannel.userLimit !== 0 ? oldVoiceChannel.userLimit : "∞")
                        .build());
                }
                break;
            }
        }

        await this.invokeEvent();
    }
}
