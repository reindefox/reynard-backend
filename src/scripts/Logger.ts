import { Application } from "@src/structures/Application";
import { Constants, DiscordAPIError } from "discord.js";
import { Format, TransformableInfo } from "logform";
import winston from "winston";

const winstonFormatter: Format = winston.format((data: TransformableInfo) => {
    if (data) {
        data.message = JSON.stringify(data);
    }

    return data;
})();

const defaultLoggerFormat: Format = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss ddd",
    }),
    winstonFormatter,
    winston.format.simple(),
    winston.format.errors({
        stack: true
    }),
);

const logger: winston.Logger = winston.createLogger({
    format: defaultLoggerFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/exception.log"
        })
    ]
});

export function createErrorLog(e: Error, path: string, logInProduction: boolean = true, text: string = "", valueToReturn: any = null): any {
    if (!Application.developmentMode && !logInProduction) {
        return valueToReturn;
    }

    /* We shouldn't log missing permissions, etc. errors if we aren't in dev. mode */
    if (Application.developmentMode) {
        if (e && e instanceof DiscordAPIError) {
            // https://discord.com/developers/docs/topics/opcodes-and-status-codes
            switch (e.code) {
                case Constants.APIErrors.UNKNOWN_WEBHOOK:
                case Constants.APIErrors.UNKNOWN_WEBHOOK_SERVICE:
                case Constants.APIErrors.MISSING_PERMISSIONS:
                case Constants.APIErrors.INVALID_WEBHOOK_TOKEN: {
                    return valueToReturn;
                }
                default: {
                    break;
                }
            }
        }
    }

    logger.error(path + " | " + text, e);

    console.log(e);

    return valueToReturn;
}

export const bootLogger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/boot.log"
        }),
    ],
});

export const warningLogger: winston.Logger = winston.createLogger({
    format: defaultLoggerFormat,
    transports: [
        new winston.transports.File({
            filename: "logs/warning.log"
        }),
    ],
});
