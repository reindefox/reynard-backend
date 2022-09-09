import { Module } from "@nestjs/common";
import { GuildManageController } from "@server/api/controllers/private/guild-manage.controller";
import { GuildController } from "@server/api/controllers/private/guild.controller";

@Module({
    controllers: [
        GuildController,
        GuildManageController
    ]
})
export class PrivateModule {

}
