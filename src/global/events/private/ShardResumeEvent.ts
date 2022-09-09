import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class ShardResumeEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "shardResume",
    };

    constructor() {
        super(ShardResumeEvent.options);
    }

    public async run(id: number, replayedEvents: number): Promise<void> {
        console.log(`Shard resume: (ID: ${id}, ReplayedEvents: ${replayedEvents})`);
    }
}
