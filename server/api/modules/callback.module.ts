import { Module } from "@nestjs/common";
import { CallbackVkController } from "@server/api/controllers/callback/vk/callback-vk.controller";

@Module({
    providers: [
        CallbackVkController
    ]
})
export class CallbackModule {

}
