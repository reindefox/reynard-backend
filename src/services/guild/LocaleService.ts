import { LocaleType } from "@src/assets/json/locale";
import { Guild, GuildModel } from "@src/database/models/Guild";
import { AbstractLocaleService } from "@src/services/abstract/AbstractLocaleService";
import { Reynard } from "@src/structures/Reynard";
import { Snowflake } from "discord.js";

export class LocaleService extends AbstractLocaleService {
    public static readonly defaultLocale: LocaleType = "en";

    public static readonly localesList: LocaleType[] = ["en", "ru"];

    private nonExistingLocale: boolean = false;

    constructor(locale: LocaleType = "en") {
        super();

        this._currentCommandsLocale = locale;
        this._currentCommandsLocale = locale;

        this._languageRecord = Reynard.locales.specific.get(locale);
        this._commandsLanguageRecord = Reynard.locales.command.get(locale);

        if (!this._languageRecord) {
            this._languageRecord = Reynard.locales.specific.get(LocaleService.defaultLocale);

            this.nonExistingLocale = true;
        }

        if (!this._commandsLanguageRecord) {
            this._commandsLanguageRecord = Reynard.locales.command.get(LocaleService.defaultLocale);

            this.nonExistingLocale = true;
        }
    }

    public static async getLocaleByGuildID(guildID: Snowflake): Promise<LocaleService> {
        const guild: GuildModel = await Guild.findOne({
            where: {
                guildID: guildID
            }
        });

        const localeService: LocaleService = new LocaleService(guild?.locale || LocaleService.defaultLocale);

        if (localeService.nonExistingLocale) {
            guild.locale = LocaleService.defaultLocale;

            await guild.save();
        }

        return localeService;
    }
}
