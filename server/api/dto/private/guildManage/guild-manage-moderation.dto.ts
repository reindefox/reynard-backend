import { IsSnowflake } from "@server/api/validators/is-snowflake.validator";
import { IsTypeof } from "@server/api/validators/is-typeof.validator";
import {
    InfractionAction,
    InfractionActionType,
    infractionActionTypes
} from "@src/database/structures/InfractionActions";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class GuildManageModerationDto {
    @IsSnowflake()
    public muteRoleID: string;

    @IsBoolean()
    public manageableMuteRole: boolean;

    @IsArray()
    @ArrayMaxSize(100)
    @ValidateNested({each: true})
    @Type(() => InfractionActionsDto)
    public infractionActions: InfractionAction[];

    @IsBoolean()
    public coolDownIgnoreRoot: boolean;

    @IsArray()
    @ArrayMaxSize(1000)
    @IsSnowflake({each: true})
    public removeRolesMute: string[];

    @IsBoolean()
    public resetWarnsOnPunishment: boolean;
}

export class InfractionActionsDto {
    @IsInt()
    @Min(1)
    public count: number;

    @IsString()
    @IsTypeof<InfractionActionType>(infractionActionTypes)
    public type: InfractionActionType;

    @IsOptional()
    @IsInt()
    @Min(0)
    public duration?: number;
}
