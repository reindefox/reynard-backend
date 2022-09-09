import { AbstractCacheService } from "@src/services/abstract/AbstractCacheService";

export class CommandExecutionCoolDownHolder extends AbstractCacheService<CommandWrite> {

}

export interface CommandWrite {
    commandName: string;
    guildID: string;
    channelID: string;
    userID: string;
}
