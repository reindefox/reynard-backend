import { Locale } from "@src/assets/lang/interfaces/Locale";
import { CommandConstructor } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractEventConstructor } from "@src/common/abstractions/event/interfaces/Event";
import { createErrorLog } from "@src/scripts/Logger";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { Client, ClientOptions, Collection } from "discord.js";

export class Reynard extends Client {
    public static client: Reynard;
    public static db: PostgreSQL;

    public static commands: Collection<string, CommandConstructor>;
    public static events: Map<string, AbstractEventConstructor>;
    public static locales: Locale;

    constructor(options?: ClientOptions) {
        super(options);

        Reynard.client = this;
    }

    public async init(): Promise<void> {
        Reynard.db = PostgreSQL.instance;

        await Reynard.db.sequelizeAuthenticate()
            .catch(e => createErrorLog(e, __filename));

        await this.loadFiles()
            .catch(e => createErrorLog(e, __filename));
    }

    private async loadFiles(): Promise<void> {
        /* We should initialize it late to avoid unexpected undefined errors in classes */
        const filesLoader: any = (await import("../scripts/FilesLoader")).FilesLoader;

        Reynard.events = await filesLoader.loadEvents()
            .catch(e => createErrorLog(e, __filename));
        Reynard.commands = await filesLoader.loadCommands()
            .catch(e => createErrorLog(e, __filename));
        Reynard.locales = await filesLoader.loadLocales()
            .catch(e => createErrorLog(e, __filename));

        await filesLoader.defaultInitialization()
            .catch(e => createErrorLog(e, __filename));
    }
}
