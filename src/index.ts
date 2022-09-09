import "module-alias/register";

import dotenv from "dotenv";

dotenv.config();

import { Application } from "@src/structures/Application";
import { createErrorLog, warningLogger } from "@src/scripts/Logger";

void Application.start();

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    createErrorLog(reason, "Index");
});

process.on("uncaughtException", (error: Error) => {
    createErrorLog(error, "Index");
});

process.on("warning", (warning: Error) => {
    warningLogger.info(warning);
});
