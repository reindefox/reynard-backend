import { BaseAutoModerationFilter } from "@src/common/modules/moderation/service/automoderation/BaseAutoModerationFilter";

export class AutoModerationMentionsFilter extends BaseAutoModerationFilter {
    public apply(maxMentions: number): boolean {
        return false;
    }
}

