import {
    IAudioAttachmentPayload, IMarketAlbumAttachmentPayload,
    IMarketAttachmentPayload,
    IPhotoAttachmentPayload,
    IPollAttachmentPayload
} from "vk-io";

export namespace VkWallGet {
    export interface Post {
        id: number;
        owner_id: number;
        from_id: number;
        created_by: number;
        date: number;
        text: string;
        reply_owner_id: number;
        reply_post_id: number;
        friends_only: 0 | 1;
        comments: Comment;
        copyright: Copyright;
        likes: Like;
        reposts: Repost;
        views: View;
        postType: PostType;
        attachments: WallAttachment.WallAttachment[];
    }

    export namespace WallAttachment {
        export type WallAttachment = {
            type: Attachment;
        } & {
            photo: IPhotoAttachmentPayload;
            poll: IPollAttachmentPayload;
            audio: IAudioAttachmentPayload;
            album: IAudioAttachmentPayload;
            market: IMarketAttachmentPayload;
            market_album: IMarketAlbumAttachmentPayload;
        };

        // https://vk.com/dev/objects/attachments_w
        export type Attachment =
            "photo"
            | "posted_photo"
            | "video"
            | "audio"
            | "doc"
            | "graffiti"
            | "link"
            | "note"
            | "app"
            | "poll"
            | "page"
            | "album"
            | "photos_list"
            | "market"
            | "market_album"
            | "sticker"
            | "pretty_cards"
            | "event"
    }

    export interface Comment {
        count: number;
        can_post?: 0 | 1;
        groups_can_post: 0 | 1;
        can_close: boolean;
        can_open: boolean;
    }

    export interface Copyright {
        id: number;
        link?: string;
        name?: string;
        type?: string;
    }

    export interface Like {
        count: number;
        user_likes?: 0 | 1;
        can_like?: 0 | 1;
        can_publish?: 0 | 1;
    }

    export interface Repost {
        count: number;
        user_reposted?: 0 | 1;
    }

    export interface View {
        views: number;
    }

    export type PostType =
        "post"
        | "copy"
        | "reply"
        | "postpone"
        | "suggest"
}
