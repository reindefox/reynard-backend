const commands = {
    eval: {
        keyName: "eval",
        keys: []
    },
    help: {
        keyName: "help",
        keys: []
    },
    mute: {
        keyName: "mute",
        keys: ["mute"]
    },
    user: {
        keyName: "user",
        keys: ["user"],
    },
    kick: {
        keyName: "kick",
        keys: ["kick"]
    },
    avatar: {
        keyName: "avatar",
        keys: ["avatar", "ava"]
    },
    stats: {
        keyName: "stats",
        keys: ["stats"]
    },
    warn: {
        keyName: "warn",
        keys: ["warn"]
    },
    ban: {
        keyName: "ban",
        keys: ["ban"]
    },
    warns: {
        keyName: "warns",
        keys: ["warns", "warnlist"]
    },
    remwarn: {
        keyName: "remwarn",
        keys: ["remwarn", "unwarn"]
    },
    fox: {
        keyName: "fox",
        keys: ["fox"]
    },
    unban: {
        keyName: "unban",
        keys: ["unban", "remban"]
    },
    petpet: {
        keyName: "petpet",
        keys: ["petpet"]
    },
    clear: {
        keyName: "clear",
        keys: ["clear"],
        flags: {
            bot: ["bot", "bots"],
            member: ["member", "members"]
        }
    },
    slowmode: {
        keyName: "slowmode",
        keys: ["slowmode", "cooldown"]
    },
    support: {
        keyName: "support",
        keys: ["support"]
    },
    emoji: {
        keyName: "emoji",
        keys: ["emoji"]
    },
    triggered: {
        keyName: "triggered",
        keys: ["triggered"]
    },
    emptychat: {
        keyName: "emptychat",
        keys: ["emptychat"]
    },
    unmute: {
        keyName: "unmute",
        keys: ["unmute", "remmute"]
    },
    server: {
        keyName: "server",
        keys: ["server"]
    },
    math: {
        keyName: "math",
        keys: ["math"]
    }
};

export default commands;
