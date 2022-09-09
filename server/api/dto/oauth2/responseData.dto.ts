export class ResponseDataDto {
    public access_token: string;
    public refresh_token: string;
    public token_type: TokenType;
    public expires_in: number;
}

export type TokenType =
    "Bearer"
    | "Bot"
