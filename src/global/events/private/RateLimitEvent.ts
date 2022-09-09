import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";

export default class RateLimitEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "rateLimit",
    };

    constructor() {
        super(RateLimitEvent.options);
    }

    public async run(rateLimitInfo: Object): Promise<void> {
        console.log(rateLimitInfo);
    }
}
