import { Module } from "@nestjs/common";
import { BasePublicController } from "@server/api/controllers/public/base.controller";

@Module({
    controllers: [
        BasePublicController
    ]
})
export class PublicModule {

}
