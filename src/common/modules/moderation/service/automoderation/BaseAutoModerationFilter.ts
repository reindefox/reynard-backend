import { BaseAutoModerationFilterConstructor } from "@src/common/modules/moderation/interfaces/BaseAutoModerationFilterConstructor";

export abstract class BaseAutoModerationFilter {
    constructor(protected readonly filterProperties: BaseAutoModerationFilterConstructor) {

    }

    public abstract apply(...data: any): boolean;
}
