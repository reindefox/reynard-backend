export const locales: Record<string, { key: LocaleType, name: string }> = {
    "english": {
        key: "en",
        name: "🇺🇸 English",
    },
    "russian": {
        key: "ru",
        name: "🇷🇺 Russian"
    }
};

export type LocaleType =
    "en"
    | "ru"
