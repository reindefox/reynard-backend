import { GuildMember, Message } from "discord.js";

export interface ModerationActionRequest {
    invoker: GuildMember;
    reason: string;
    duration: number;
}

export interface MuteModerationActionRequest extends ModerationActionRequest {
    member: GuildMember;
}

export interface BanModerationActionRequest extends ModerationActionRequest {
    userID: string;
    message: Message;
    deleteDays: number;
}
