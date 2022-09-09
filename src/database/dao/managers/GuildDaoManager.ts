import { LocaleType } from "@src/assets/json/locale";
import { AbstractDaoManager } from "@src/database/dao/abstractions/AbstractDaoManager";
import { Guild, GuildModel } from "@src/database/models/Guild";
import { GuildLocaleService } from "@src/services/guild/GuildLocaleService";
import { Guild as DiscordGuild } from "discord.js";

export class GuildDaoManager extends AbstractDaoManager<DiscordGuild, GuildModel> {
    public localeService: GuildLocaleService;

    public async initInstance(): Promise<void> {
        await this.getOrCreate();

        this.localeService = new GuildLocaleService(this.model);
    }

    public static async createInstance(guild: DiscordGuild): Promise<GuildDaoManager> {
        const guildDaoManager: GuildDaoManager = new GuildDaoManager(guild);

        await guildDaoManager.initInstance();

        return guildDaoManager;
    }

    public static async getOrCreate(guild: DiscordGuild): Promise<GuildModel> {
        const dataModel: [GuildModel, boolean] = await Guild.findOrCreate({
            where: {
                guildID: guild.id
            },
            defaults: {
                guildID: guild.id,
                locale: GuildDaoManager.getGuildLocale(guild)
            }
        });

        return dataModel[0];
    }

    public get guild(): DiscordGuild {
        return this.data;
    }

    public async getOrCreate(): Promise<GuildModel> {
        return this.model = await GuildDaoManager.getOrCreate(this.data);
    }

    public static getGuildLocale(guild: DiscordGuild): LocaleType {
        const preferredLocale: string = guild?.preferredLocale?.toLowerCase();

        switch (preferredLocale) {
            case "russia": {
                return "ru";
            }
            default: {
                return "en";
            }
        }
    }

    public hasPremium(): boolean {
        return this.model.premiumUntil > Math.floor(new Date().getTime() / 1000);
    }
}
