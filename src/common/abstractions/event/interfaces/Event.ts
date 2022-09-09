import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";

export interface AbstractEventConstructor {
    run(...args: unknown[]): Promise<void>;

    options?: AbstractEventOptions;
}

export interface LoggingEventConstructor extends AbstractEventConstructor {
    new(guildDaoManager: GuildDaoManager): void;
}

export interface AbstractEventOptions {
    keyName: string;
    name?: string;
    category?: string;
    description?: string;
}
