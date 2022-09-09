export interface InfractionAction {
    count: number;
    type: InfractionActionType;
    duration?: number;
}

export type InfractionActionType =
    "kick"
    | "ban"
    | "mute"

export const infractionActionTypes: InfractionActionType[] = [
    "kick",
    "ban",
    "mute"
];
