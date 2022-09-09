import { Base } from "@src/common/abstractions/Base";
import { AbstractEventConstructor, AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { ModulesLoader } from "@src/modules/ModulesLoader";
import { createErrorLog } from "@src/scripts/Logger";
import { Guild } from "discord.js";

export abstract class AbstractEvent extends Base implements AbstractEventConstructor {
    protected constructor(protected readonly eventOptions: AbstractEventOptions) {
        super();
    }

    protected guildDaoManager: GuildDaoManager;

    protected async initialize(guild: Guild, ...args: unknown[]): Promise<void> {
        await this.initializeByName(this.eventOptions.keyName, guild, ...args)
            .catch(e => createErrorLog(e, __filename));
    }

    protected async initializeByName(name: string, guild: Guild, ...args: unknown[]): Promise<void> {
        if (guild) {
            if (!guild.me) {
                return;
            }

            this.guildDaoManager = new GuildDaoManager(guild);

            await this.guildDaoManager.initInstance();

            this.client.emit(ModulesLoader.moduleName + name,
                this.eventOptions, this.guildDaoManager, ...args);
        }
    }

    public abstract run(...args: unknown[]): Promise<void>;
}
