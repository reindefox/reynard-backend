export const eventsList: EventList = {
    channelCreate: {id: "", toggle: false},
    channelDelete: {id: "", toggle: false},
    channelPinsUpdate: {id: "", toggle: false},
    channelUpdate: {id: "", toggle: false},
    emojiCreate: {id: "", toggle: false},
    emojiDelete: {id: "", toggle: false},
    emojiUpdate: {id: "", toggle: false},
    guildBanAdd: {id: "", toggle: false},
    guildBanRemove: {id: "", toggle: false},
    guildIntegrationsUpdate: {id: "", toggle: false},
    guildMemberAdd: {id: "", toggle: false},
    guildMemberRemove: {id: "", toggle: false},
    guildMemberUpdate: {id: "", toggle: false},
    guildUpdate: {id: "", toggle: false},
    inviteCreate: {id: "", toggle: false},
    inviteDelete: {id: "", toggle: false},
    messageDelete: {id: "", toggle: false},
    messageDeleteBulk: {id: "", toggle: false},
    messageReactionRemoveAll: {id: "", toggle: false},
    messageUpdate: {id: "", toggle: false},
    roleCreate: {id: "", toggle: false},
    roleDelete: {id: "", toggle: false},
    roleUpdate: {id: "", toggle: false},
    voiceChannelJoin: {id: "", toggle: false},
    voiceChannelLeave: {id: "", toggle: false},
    voiceChannelSwitch: {id: "", toggle: false},
    webhookUpdate: {id: "", toggle: false},
};

export interface EventList {
    [name: string]: EventListOptions;
}

export interface EventListOptions {
    id: string;
    toggle: boolean;
}
