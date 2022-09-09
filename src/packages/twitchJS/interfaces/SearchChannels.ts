export interface SearchChannels {
    _total: number;
    channels: Channel[];
}

export interface Channel {
    _id: number;
    broadcaster_language: string;
    created_at: string;
    display_name: string;
    followers: number;
    game: string;
    language: string;
    logo: string;
    mature: boolean;
    name: string;
    partner: boolean;
    profile_banner: string;
    profile_banner_background_color: string;
    status: string;
    updated_at: string;
    url: string;
    video_banner: string;
    views: number;
}
