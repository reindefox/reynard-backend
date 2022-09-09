import { IsSnowflake } from "@server/api/validators/is-snowflake.validator";
import { ArrayMaxSize, IsArray, IsBoolean, IsObject, IsString } from "class-validator";

export class GuildManageLoggingDto {
    @IsBoolean()
    public toggle: boolean;

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public logIgnoredMembers: string[];

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public logIgnoredChannels: string[];

    @IsBoolean()
    public showLogExecutor: boolean;

    @IsBoolean()
    public listenBots: boolean;

    @IsObject()
    public logs: Record<string, LogsDto>;
}

class LogsDto {
    @IsSnowflake()
    public id: string;

    @IsBoolean()
    public toggle: boolean;
}
