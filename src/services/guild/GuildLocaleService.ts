import { LocaleType } from "@src/assets/json/locale";
import { GuildModel } from "@src/database/models/Guild";
import { AbstractLocaleService } from "@src/services/abstract/AbstractLocaleService";
import { LocaleService } from "@src/services/guild/LocaleService";
import { Reynard } from "@src/structures/Reynard";

export class GuildLocaleService extends AbstractLocaleService {
    private readonly guild: GuildModel;

    constructor(guild?: GuildModel) {
        super();

        this.guild = guild;

        this._currentLocale = <LocaleType>(guild?.locale || LocaleService.defaultLocale);
        this._currentCommandsLocale = <LocaleType>(guild?.commandsLocale || LocaleService.defaultLocale);

        let requiresSaving: boolean = false;

        this._languageRecord = Reynard.locales.specific.get(this._currentLocale);
        this._commandsLanguageRecord = Reynard.locales.command.get(this._currentCommandsLocale);

        if (this.guild && !this._languageRecord) {
            this._languageRecord = Reynard.locales.specific.get(LocaleService.defaultLocale);

            this.guild.locale = <LocaleType>LocaleService.defaultLocale;

            requiresSaving = true;
        }

        if (this.guild && !this._commandsLanguageRecord) {
            this._commandsLanguageRecord = Reynard.locales.command.get(LocaleService.defaultLocale);

            this.guild.commandsLocale = <LocaleType>LocaleService.defaultLocale;

            requiresSaving = true;
        }

        if (requiresSaving) {
            void this.guild.save();
        }
    }
}
