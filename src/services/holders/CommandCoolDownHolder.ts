import { AbstractCacheService } from "@src/services/abstract/AbstractCacheService";

export class CommandCoolDownHolder extends AbstractCacheService<CommandCoolDown> {
    constructor() {
        super();

        /* Garbage collector to avoid memory leak */
        setInterval(() => {
            for (const coolDown of this.data) {
                if (coolDown.removeAt <= new Date().getTime()) {
                    const index: number = this.data.indexOf(coolDown);

                    this.data.splice(index, 1);
                }
            }
        }, 60000);
    }
}

export interface CommandCoolDown {
    key: string;
    guildID: string;
    userID: string;
    channelID?: string;
    removeAt?: number;
}
