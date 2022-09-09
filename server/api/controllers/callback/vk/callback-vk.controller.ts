import { Body, Controller, Param, Post } from "@nestjs/common";
import { AbstractController } from "@server/api/abstractions/abstract.controller";
import { VkWallPostNew } from "@src/api/subscriptions/vk/types/event/VkWallPostNew";
import { VkGroupEvent } from "@src/api/subscriptions/vk/types/VkGroupEvent";
import { VkPosting } from "@src/api/subscriptions/vk/VkPosting";
import { VKSubscription, VKSubscriptionModel } from "@src/database/models/VKSubscription";

@Controller("callback/vk/")
export class CallbackVkController extends AbstractController {
    @Post(":token")
    public async execute(
        @Param("token") token: string,
        @Body() body: VkGroupEvent<unknown>
    ): Promise<void> {
        if (!token || !body) {
            return;
        }

        const vkSubscription: VKSubscriptionModel = await VKSubscription.findOne({
            where: {
                token: token
            }
        });

        if (!vkSubscription) {
            return;
        }

        switch (body.type) {
            case "wall_post_new": {
                const vkPosting: VkPosting = new VkPosting(<VkGroupEvent<VkWallPostNew>>body, vkSubscription);
                await vkPosting.init();
                break;
            }
            default: {
                break;
            }
        }
    }
}
