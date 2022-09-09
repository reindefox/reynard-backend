import { IsCommand } from "@server/api/validators/is-command.validator";
import { CommandConfigOptions } from "@src/database/models/CommandConfig";
import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsString, Max, Min } from "class-validator";

export class GuildManageCommandDto implements CommandConfigOptions {
    @IsString()
    @IsCommand()
    public key: string;

    @IsBoolean()
    public toggle: boolean;

    @IsBoolean()
    public delSrcMsg: boolean;

    @IsBoolean()
    public hidden: boolean;

    @IsBoolean()
    public nsfwOnly: boolean;

    @IsInt()
    @Min(0)
    @Max(10000)
    public coolDown: number;

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public ignoredRoles: string[];

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public allowedRoles: string[];

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public ignoredChannels: string[];

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public allowedChannels: string[];

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public ignoredMembers: string[];

    @IsArray()
    @ArrayMaxSize(1000)
    @IsString({each: true})
    public allowedMembers: string[];
}
