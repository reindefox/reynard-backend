import { IsColor } from "@server/api/validators/is-color.validator";
import { IsLanguage } from "@server/api/validators/is-language.validator";
import { IsNotBlank } from "@server/api/validators/is-not-blank.validator";
import { IsTimezone } from "@server/api/validators/is-timezone.validator";
import { LocaleType } from "@src/assets/json/locale";
import { TimezoneType } from "@src/assets/json/timezone";
import { IsBoolean, IsInt, IsString, Length, Max, Min } from "class-validator";
import { HexColorString } from "discord.js";

export class GuildManageCommonDto {
    @IsString()
    @Length(1, 16)
    @IsNotBlank()
    public prefix: string;

    @IsLanguage()
    public locale: LocaleType;

    @IsLanguage()
    public commandsLocale: LocaleType;

    @IsString()
    @IsTimezone()
    public timezone: TimezoneType;

    @IsBoolean()
    public mentionUsers: boolean;

    @IsBoolean()
    public useReplies: boolean;

    @IsInt()
    @Min(0)
    @Max(60)
    public delSucMsgAfter: number;

    @IsInt()
    @Min(0)
    @Max(60)
    public delErrMsgAfter: number;

    @IsBoolean()
    public delSrcMsg: boolean;

    @IsColor()
    public color: HexColorString;
}
