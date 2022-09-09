import "module-alias/register";

import { config } from "@src/structures/Application";
import { bootLogger, createErrorLog, warningLogger } from "@src/scripts/Logger";
import { Reynard } from "@src/structures/Reynard";
import { Intents } from "discord.js";

export const client: Reynard = new Reynard({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.DIRECT_MESSAGES,
    ]
});

void client.init();

void client.login(config.clientToken);

bootLogger.info(`${new Date()} | ${new Date().getTime()} | ${process.pid}`);

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    createErrorLog(reason, "Client");
});

process.on("uncaughtException", (error: Error) => {
    createErrorLog(error, "Client");
});

process.on("warning", (warning: Error) => {
    warningLogger.info(warning);
});
