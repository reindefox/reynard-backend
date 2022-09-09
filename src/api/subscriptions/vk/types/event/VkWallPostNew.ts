import { VkWallGet } from "@src/api/subscriptions/vk/types/VkWallGet";

export interface VkWallPostNew {
    vkWallGet: VkWallGet.Post;
    postponed_id: number;
}
