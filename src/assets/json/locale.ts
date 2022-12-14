export const locales: Record<string, { key: LocaleType, name: string }> = {
    "english": {
        key: "en",
        name: "πΊπΈ English",
    },
    "russian": {
        key: "ru",
        name: "π·πΊ Russian"
    }
};

export type LocaleType =
    "en"
    | "ru"
