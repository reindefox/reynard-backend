const commands = {
    eval: {
        keyName: "выполнить",
        keys: []
    },
    help: {
        keyName: "хелп",
        keys: []
    },
    mute: {
        keyName: "мьют",
        keys: ["мут", "мьют"]
    },
    user: {
        keyName: "юзер",
        keys: ["юзер", "пользователь"]
    },
    kick: {
        keyName: "кик",
        keys: ["кик"]
    },
    avatar: {
        keyName: "аватар",
        keys: ["аватар", "ава"]
    },
    stats: {
        keyName: "стат",
        keys: ["стат", "стата", "статистика"]
    },
    warn: {
        keyName: "пред",
        keys: ["пред", "варн"]
    },
    ban: {
        keyName: "бан",
        keys: ["бан"]
    },
    warns: {
        keyName: "преды",
        keys: ["преды"]
    },
    remwarn: {
        keyName: "снятьпред",
        keys: ["снятьпред"]
    },
    fox: {
        keyName: "лис",
        keys: ["лис", "лиса"]
    },
    unban: {
        keyName: "разбан",
        keys: ["разбан"]
    },
    petpet: {
        keyName: "погладить",
        keys: ["погладить"]
    },
    clear: {
        keyName: "очистить",
        keys: ["очистить", "удалить"],
        flags: {
            bot: ["бот", "боты"],
            member: ["участник", "участники"]
        }
    },
    slowmode: {
        keyName: "слоумод",
        keys: ["слоумод", "кулдаун"]
    },
    support: {
        keyName: "поддержка",
        keys: ["поддержка"]
    },
    emoji: {
        keyName: "эмодзи",
        keys: ["эмодзи"]
    },
    triggered: {
        keyName: "триггеред",
        keys: ["триггеред"]
    },
    emptychat: {
        keyName: "пустойчат",
        keys: ["пустойчат"]
    },
    unmute: {
        keyName: "снятьмут",
        keys: ["снятьмут"]
    },
    server: {
        keyName: "сервер",
        keys: ["сервер"]
    },
    math: {
        keyName: "вычислить",
        keys: ["вычислить", "посчитать"]
    }
};

export default commands;
