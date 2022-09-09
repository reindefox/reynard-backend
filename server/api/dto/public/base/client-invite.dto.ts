import { IsSnowflake } from "@server/api/validators/is-snowflake.validator";

export class ClientInviteDto {
    @IsSnowflake()
    public id: string;
}
