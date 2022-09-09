import { GuildManageCommandDto } from "@server/api/dto/private/guildManage/guild-manage-command.dto";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, ValidateNested } from "class-validator";

export class GuildManageCommandPackDto {
    @IsArray()
    @ValidateNested({each: true})
    @ArrayMaxSize(1000)
    @Type(() => GuildManageCommandDto)
    public commands: GuildManageCommandDto[];
}
