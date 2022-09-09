import { VkWallPostNew } from "@src/api/subscriptions/vk/types/event/VkWallPostNew";

export interface VkGroupEvent<T extends VkGroupEventType | unknown> {
    type: VkGroupPostEventType;
    object: T;
    group_id: string;
}

export type VkGroupEventType =
    VkWallPostNew

export type VkGroupPostEventType =
    "wall_post_new"
    | "wall_repost"
