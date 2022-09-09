import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { CallbackVkController } from "@server/api/controllers/callback/vk/callback-vk.controller";
import { MainController } from "@server/api/controllers/main.controller";
import { NotFoundExceptionFilter } from "@server/api/filters/NotFoundExceptionFilter";
import { RateLimitGuard } from "@server/api/guards/rate-limit.guard";
import { CallbackModule } from "@server/api/modules/callback.module";
import { OAuth2Module } from "@server/api/modules/oauth2.module";
import { PrivateModule } from "@server/api/modules/private.module";
import { PublicModule } from "@server/api/modules/public.module";
import { TaskService } from "@server/api/providers/TaskService";
import cors from "cors";

@Module({
    imports: [
        PublicModule,
        PrivateModule,
        OAuth2Module,
        CallbackModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({
            limit: 30,
            ttl: 60,
        }),
    ],
    controllers: [
        MainController
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RateLimitGuard
        },
        {
            provide: APP_FILTER,
            useClass: NotFoundExceptionFilter
        },
        TaskService,
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(cors({
                origin: ["https://api.vk.com/"],
            }))
            .forRoutes(CallbackVkController)
    }
}
