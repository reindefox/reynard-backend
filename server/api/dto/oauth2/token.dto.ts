import { IsString } from "class-validator";

export class TokenDto {
    @IsString()
    public code: string;
}
