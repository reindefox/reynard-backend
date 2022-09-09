import { IsBoolean } from "class-validator";

export class GuildManageResetDto {
    @IsBoolean()
    public resetSettings: boolean;

    @IsBoolean()
    public resetPunishments: boolean;
}
