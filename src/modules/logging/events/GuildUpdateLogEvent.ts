import { color } from "@src/assets/json/colors";
import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { FormatUtils } from "@src/global/utils/FormatUtils";
import { icons } from "@src/modules/logging/assets/json/icons";
import { LineType } from "@src/modules/logging/utils/LogLineStringBuilder";
import { Guild, GuildMember } from "discord.js";

export default class LogGuildUpdate extends AbstractLoggingEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildUpdate",
        name: "event.guildUpdate.name",
    };

    constructor(guildDaoManager: GuildDaoManager) {
        super(LogGuildUpdate.options, guildDaoManager);
    }

    private static readonly systemChannelFlags = {
        0: "WELCOME_MESSAGE, BOOST_MESSAGE",
        1: "WELCOME_MESSAGE",
        2: "BOOST_MESSAGE",
        3: "NONE"
    };

    protected async execute(oldGuild: Guild, newGuild: Guild): Promise<void> {
        const audit = await this.fetchAuditLogs(newGuild, "GUILD_UPDATE");

        if (!this.canContinueExecution(null, audit?.entries.first().executor)) return;

        this.messageBuilder
            .setColor(color.blue)
            .setAuthor(this.translate("eventLogger.guildUpdate.name"), icons.guildUpdate)
            .setDescription(this.translate("eventLogger.guildUpdate.description"))
            .setEventExecutor(audit);

        if (newGuild.afkChannelId !== oldGuild.afkChannelId) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.afkChannelUpdate"), this.logStringBuilder
                .addNewDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.name"), newGuild.afkChannel?.name)
                .addFieldLine("ID", newGuild.afkChannelId)
                .addOldDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.name"), oldGuild.afkChannel?.name)
                .addFieldLine("ID", oldGuild.afkChannelId)
                .build());
        }
        if (newGuild.afkTimeout !== oldGuild.afkTimeout) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.afkTimeoutUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.afkTimeout / 60 + " " + this.translate("global.min"))
                .addFieldLineProperty(LineType.OLD, oldGuild.afkTimeout / 60 + " " + this.translate("global.min"))
                .build());
        }
        if (newGuild.banner !== oldGuild.banner) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.bannerUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.bannerURL(), false)
                .addFieldLineProperty(LineType.OLD, oldGuild.bannerURL(), false)
                .build());
        }
        if (newGuild.defaultMessageNotifications !== oldGuild.defaultMessageNotifications) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.notificationsUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.defaultMessageNotifications?.toString().toLowerCase())
                .addFieldLineProperty(LineType.OLD, oldGuild.defaultMessageNotifications?.toString().toLowerCase())
                .build());
        }
        if (newGuild.discoverySplash !== oldGuild.discoverySplash) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.discoverySplashUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.discoverySplashURL(), false)
                .addFieldLineProperty(LineType.OLD, oldGuild.discoverySplashURL(), false)
                .build());
        }
        if (newGuild.description !== oldGuild.description) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.descriptionUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.description)
                .addFieldLineProperty(LineType.OLD, oldGuild.description)
                .build());
        }
        if (newGuild.explicitContentFilter !== oldGuild.explicitContentFilter) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.explicitFilterUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.explicitContentFilter?.toString().replace(/[_]/g, " "))
                .addFieldLineProperty(LineType.OLD, oldGuild.explicitContentFilter?.toString().replace(/[_]/g, " "))
                .build());
        }
        if (newGuild.mfaLevel !== oldGuild.mfaLevel) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.mfaLevelUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.mfaLevel)
                .addFieldLineProperty(LineType.OLD, oldGuild.mfaLevel)
                .build());
        }
        if (newGuild.name !== oldGuild.name) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.nameUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.name)
                .addFieldLineProperty(LineType.OLD, oldGuild.name)
                .build());
        }
        if (newGuild.iconURL().toString() !== oldGuild.iconURL().toString()) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.iconUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.iconURL(), false)
                .addFieldLineProperty(LineType.OLD, oldGuild.iconURL(), false)
                .build());
        }
        if (newGuild.ownerId !== oldGuild.ownerId) {
            const newGuildOwner: GuildMember = await newGuild.fetchOwner()
                .catch(() => null);
            const oldGuildOwner: GuildMember = await oldGuild.fetchOwner()
                .catch(() => null);

            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.ownerUpdate"), this.logStringBuilder
                .addNewDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.user"), newGuildOwner.toString(), false)
                .addFieldLine("ID", newGuild.ownerId)
                .addFieldLine(this.translate("eventLogger.keyword.tag"), newGuildOwner.user.tag)
                .addOldDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.user"), oldGuildOwner?.toString(), false)
                .addFieldLine("ID", oldGuild.ownerId)
                .addFieldLine(this.translate("eventLogger.keyword.tag"), oldGuildOwner?.user?.tag)
                .build());
        }
        if (newGuild.partnered !== oldGuild.partnered) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.partnerStatusUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, this.translate("global." + newGuild.partnered))
                .addFieldLineProperty(LineType.OLD, this.translate("global." + oldGuild.partnered))
                .build());
        }
        if (newGuild.preferredLocale !== oldGuild.preferredLocale) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.preferredLocaleUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.preferredLocale)
                .addFieldLineProperty(LineType.OLD, oldGuild.preferredLocale)
                .build());
        }
        if (newGuild.publicUpdatesChannel !== oldGuild.publicUpdatesChannel) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.publicUpdatesChannelUpdate"), this.logStringBuilder
                .addNewDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), newGuild.publicUpdatesChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), newGuild.publicUpdatesChannel?.name)
                .addFieldLine("ID", newGuild.publicUpdatesChannelId)
                .addOldDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), oldGuild.publicUpdatesChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), oldGuild.publicUpdatesChannel?.name)
                .addFieldLine("ID", oldGuild.publicUpdatesChannelId)
                .build());
        }
        if (newGuild.rulesChannel !== oldGuild.rulesChannel) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.rulesChannelUpdate"), this.logStringBuilder
                .addNewDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), newGuild.rulesChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), newGuild.rulesChannel?.name)
                .addFieldLine("ID", newGuild.rulesChannelId)
                .addOldDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), oldGuild.rulesChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), oldGuild.rulesChannel?.name)
                .addFieldLine("ID", oldGuild.rulesChannelId)
                .build());
        }
        if (newGuild.splash !== oldGuild.splash) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.splashUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, newGuild.splashURL())
                .addFieldLineProperty(LineType.OLD, oldGuild.splashURL())
                .build());
        }
        if (newGuild.systemChannel !== oldGuild.systemChannel) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.systemChannelUpdate"), this.logStringBuilder
                .addNewDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), newGuild.systemChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), newGuild.systemChannel?.name)
                .addFieldLine("ID", newGuild.systemChannelId)
                .addOldDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), oldGuild.systemChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), oldGuild.systemChannel?.name)
                .addFieldLine("ID", newGuild.systemChannelId)
                .build());
        }
        if (newGuild.systemChannelFlags.bitfield !== oldGuild.systemChannelFlags.bitfield) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.systemChannelFlagsUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, FormatUtils.formatFlag(LogGuildUpdate.systemChannelFlags[newGuild.systemChannelFlags?.bitfield]))
                .addFieldLineProperty(LineType.OLD, FormatUtils.formatFlag(LogGuildUpdate.systemChannelFlags[oldGuild.systemChannelFlags?.bitfield]))
                .build());
        }
        if (newGuild.verificationLevel !== oldGuild.verificationLevel) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.verificationLevelUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, FormatUtils.formatFlag(newGuild.verificationLevel))
                .addFieldLineProperty(LineType.OLD, FormatUtils.formatFlag(oldGuild.verificationLevel))
                .build());
        }
        if (newGuild.verified !== oldGuild.verified) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.verifiedStatusUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, this.translate("global." + newGuild.verified))
                .addFieldLineProperty(LineType.OLD, this.translate("global." + oldGuild.verified))
                .build());
        }
        if (newGuild.widgetChannel !== oldGuild.widgetChannel) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.widgetChannelUpdate"), this.logStringBuilder
                .addNewDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), newGuild.widgetChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), newGuild.widgetChannel?.name)
                .addFieldLine("ID", newGuild.widgetChannelId)
                .addOldDataLine()
                .addFieldLine(this.translate("eventLogger.keyword.channel"), oldGuild.widgetChannel, false)
                .addFieldLine(this.translate("eventLogger.keyword.name"), oldGuild.widgetChannel?.name)
                .addFieldLine("ID", oldGuild.widgetChannelId)
                .build());
        }
        if (newGuild.widgetEnabled !== oldGuild.widgetEnabled) {
            this.messageBuilder.addField(this.translate("eventLogger.guildUpdate.widgetToggleUpdate"), this.logStringBuilder
                .addFieldLineProperty(LineType.NEW, this.translate("global." + newGuild.widgetEnabled))
                .addFieldLineProperty(LineType.OLD, this.translate("global." + oldGuild.widgetEnabled))
                .build());
        }

        await this.invokeEvent();
    }
}
