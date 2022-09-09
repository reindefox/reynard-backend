import { Module } from "@nestjs/common";
import { OAuth2Controller } from "@server/api/controllers/oauth2/oauth2.controller";

@Module({
    controllers: [
        OAuth2Controller
    ]
})
export class OAuth2Module {

}
