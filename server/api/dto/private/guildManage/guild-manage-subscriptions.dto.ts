import { SubscriptionType } from "@src/api/subscriptions/BasePosting";
import { IsObject, IsOptional, IsString } from "class-validator";

export class GuildManageSubscriptionsDto {
    @IsString()
    public type: SubscriptionType;

    @IsOptional()
    @IsObject()
    public data:
        { name: string, code: string }
        | { id: string }
        | { login: string };
}
