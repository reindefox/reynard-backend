export interface Stream {
    data: StreamData[];
    pagination: Pagination;
}

export interface StreamData {
    id: string;
    userId: string;
    userLogin: string;
    userName: string;
    gameId: string;
    gameName: string;
    type: string;
    title: string;
    viewerCount: number;
    startedAt: string;
    language: string;
    thumbnailUrl: string;
    tagIds: string[];
    isMature: boolean;
}

export interface Pagination {
    cursor: string;
}
