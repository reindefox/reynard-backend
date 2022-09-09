import { LocaleType } from "@src/assets/json/locale";

export interface Locale {
    common: LocaleLanguage;
    command: LocaleLanguage;
    specific: LocaleLanguage;
}

export type LocaleLanguage = Map<LocaleType, Record<any, any>>
