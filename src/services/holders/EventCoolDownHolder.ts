import { AbstractCacheService } from "@src/services/abstract/AbstractCacheService";

export class EventCoolDownHolder extends AbstractCacheService<EventHolder> {

}

export interface EventHolder {
    guildID: string;
    name: string;
}
