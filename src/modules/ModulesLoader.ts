import { AbstractEventOptions, LoggingEventConstructor } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractLoggingEvent } from "@src/common/abstractions/event/model/AbstractLoggingEvent";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { createErrorLog } from "@src/scripts/Logger";
import { Reynard } from "@src/structures/Reynard";
import { readdir } from "fs/promises";

export class ModulesLoader {
    public static readonly moduleName: string = "module_";

    public async loadModules(): Promise<void> {
        const loggingEvents: Map<any, LoggingEventConstructor> = await ModulesLoader.setLoggingEvents();

        const eventKeys: string[] = [...loggingEvents.keys()];

        for (let i in eventKeys) {
            if (eventKeys.hasOwnProperty(i)) {
                const event: LoggingEventConstructor = loggingEvents.get(eventKeys[i]);

                Reynard.client.on(eventKeys[i], async (eventOptions: AbstractEventOptions, guildDaoManager: GuildDaoManager, ...args: unknown[]) => {
                    if (guildDaoManager && guildDaoManager.data && guildDaoManager.model?.logModuleToggle) {
                        if (event) {
                            await (<AbstractLoggingEvent><unknown>new event(guildDaoManager))
                                .run(...args)
                                .catch(e => createErrorLog(e, __filename));
                        }
                    }
                });
            }
        }
    }

    private static async setLoggingEvents(): Promise<Map<any, LoggingEventConstructor>> {
        const loggingEvents: Map<string, LoggingEventConstructor> = new Map<string, LoggingEventConstructor>();

        const files: string[] = await readdir("src/modules/logging/events/");

        for (let i in files) {
            if (files.hasOwnProperty(i)) {
                const eventName: string = files[i].split(".")[0];
                const LoggingEventConstructor: any = (await import("./logging/events/" + eventName)).default;

                loggingEvents.set(ModulesLoader.moduleName + LoggingEventConstructor.options.keyName, LoggingEventConstructor);
            }
        }

        return loggingEvents;
    }
}
