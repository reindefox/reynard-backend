import { inlineCode } from "@discordjs/builders";
import { emoji } from "@src/assets/json/emoji";
import { properties } from "@src/assets/json/properties";
import TriggeredCommand from "@src/global/commands/fun/TriggeredCommand";
import ClearCommand from "@src/global/commands/moderation/ClearCommand";
import prettyBytes from "pretty-bytes";

const en_US = {
    global: {
        min: "min",
        kbps: "kbps",
        none: "None",
        true: "Yes",
        false: "No",
        clientError: `An internal error has occurred. Please, contact with developer on the support server: [\`*click here*\`](${properties.communityServer.url})`,
        undefined: "Unknown",
        null: "Unknown",
        0: "No",
        1: "Yes"
    },
    command: {
        keyword: {
            name: "Command",
            category: "Category",
            description: "Description",
            usage: "Usage",
            aliases: "Aliases",
            requiredPermissions: "Required permissions",
            none: "None"
        },
        response: {
            done: "**Done**",
            error: "**Error**",
            missArgs: "**Missing Arguments**\n" +
                "**<...>** — Required parameter\n" +
                "**[...]** — Optional parameter\n" +
                "**A | B | C** — Any of these parameters",
            missPerms: "**Missing Permissions**",
            waitAns: "**Waiting for an answer**"
        },
        category: {
            information: "Information",
            settings: "Settings",
            utilities: "Utilities",
            moderation: "Moderation",
            fun: "Fun"
        },
        run: {
            serverOnly: "This command is available only on the server",
            dmOnly: "This command is available only in bot's DM",
            lowExecutorPermissions: "You can't kick following members as your highest role is lower than someone's of them:",
            lowClientPermissions: "Bot's role is lower than following one of following member's highest role:",
            selfAction: "You can't use this command on yourself",
            clientAction: "You can't use this command on the bot",
            botAction: "You can't use this command on bots",
            ownerAction: "You can't user this command on server owner",
            maxMentions: "{%size%} mentions is the maximum count per command",
        },
        requiredParameters: "<...> — Required parameter\n[...] — Optional parameter\nA | B | C — Any of these parameters",
        getDetailedInfo: `${emoji.yellowPoint.string} Website: {%url%}`,
        example: "Example",
        duration: "Duration",
        moderator: "Moderator",
        reason: "Reason",
        until: "Until",
        minDuration: "\`{%sec%}\` seconds is the minimum duration.",
        clientPermissions: "This command requires following bot permissions:",
        user: {
            common: "Common",
            about: "{%user%}",
            status: "Status",
            customStatus: "Custom status",
            statusType: "Type",
            playing: "Playing",
            username: "Username",
            joinedAt: "Joined at",
            registered: "Registered",
            usage: "[@Member | ID]",
            description: "Shows information about member: name, status, join and register dates, avatar and so on.",
            examples: [
                {
                    usage: "",
                    description: "Shows information about member invoked this command."
                },
                {
                    usage: "@Member",
                    description: "Shows information about mentioned member."
                },
                {
                    usage: "345980126820958210",
                    description: "Shows information about member with ID specified."
                }
            ]
        },
        kick: {
            successResponse: "Following members have been kicked:",
            nobody: "Nobody was kicked. Maybe you've done something wrong.",
            usage: "<@Member | ID, [@Member | ID, [...]]> [reason]",
            description: "Kicks member(s) from server.",
            examples: [
                {
                    usage: "@Member",
                    description: "Kicks specified members."
                },
                {
                    usage: "@Member offensive language",
                    description: "Kicks specified members with reason."
                }
            ]
        },
        help: {
            usage: "[category]",
            description: "Shows help message with all available commands with its categories.",
            examples: [
                {
                    usage: "",
                    description: "Show all available for invoker commands."
                },
                {
                    usage: "moderation",
                    description: "Show all available commands of specified category."
                },
            ]
        },
        ban: {
            banReason: "Per infraction",
            usage: "<@Member | ID, [@Member | ID, [...]]> [duration] [number of days to delete messages for (0-7)] [reason]",
            description: "Gives a ban to specified user(s).",
            successResponse: "Following members have been banned:",
            nobody: "Nobody was banned. Maybe you've done something wrong.",
            examples: [
                {
                    usage: "@Member",
                    description: "Gives a permanent ban to selected member."
                },
                {
                    usage: "@Member inappropriate behavior",
                    description: "Gives a permanent ban to selected member with specified reason."
                },
                {
                    usage: "@Member 1mo 3 stop arguing",
                    description: "Gives a ban with a reason expiring in 1 month and delete member's messages for the last 3 days."
                }
            ]
        },
        unban: {
            memberNotFound: "No such member found.",
            unbanned: "{%user%} has been unbanned.",
            description: "Removes ban from specified user.",
            usage: "<@Member | ID | Tag | Username> [reason]",
            examples: [
                {
                    usage: "345980126820958210 amnesty",
                    description: "Unban member with specified reason."
                }
            ]
        },
        warn: {
            successResponse: "Following members have been warned:",
            nobody: "Nobody was warned. Maybe you've done something wrong.",
            additionalPunishment: "Following users have been additionally punished:",
            usage: "<@Member | ID, [@Member | ID, [...]]> [duration] [reason]",
            hasBeenKicked: "has been kicked",
            hasBeenBanned: "has been banned",
            kickReason: "Per infraction",
            description: "Gives a warning to specified member(s).",
            examples: [
                {
                    usage: "@Member",
                    description: "Gives a permanent warning to selected member."
                },
                {
                    usage: "@Member offensive language",
                    description: "Gives a permanent warning to selected member with specified reason."
                },
                {
                    usage: "@Member 7d12h offensive language",
                    description: "Gives a warning to selected member expiring in 7 days and 12 hours."
                }
            ]
        },
        warns: {
            total: "Total warnings of {%username%} [{%count%}]",
            page: "Page",
            notFound: "No warnings found.",
            description: "Shows all warnings of specified user",
            usage: "[@Member | ID]"
        },
        remwarn: {
            usage: "<case number>",
            description: "Deletes specified warning case by its unique number.",
            examples: [
                {
                    usage: "25",
                    description: "Removes warning with case number 25."
                }
            ],
            notFound: "There's no warning with case **\`#{%caseID%}\`**",
            success: "Warning with case **\`#{%caseID%}\`** has been deleted"
        },
        avatar: {
            header: "Avatar for {%user%}",
            description: "Gets avatar of specified member.",
            usage: "<@Member | ID>"
        },
        stats: {
            description: "Get detailed statistics of the bot.",
            statistics: "{%bot_username%} Statistics",
            valuesUpdateCoolDown: `Some values are updated in a timely manner, regardless of the command calling[.](${properties.secretUrl})`,
            common: "Common",
            servers: "Servers",
            users: "Users",
            client: "Client",
            information: "Information",
            ping: "Ping",
            writtenIn: "Written in",
            devPage: "Developer's page",
            version: "Version",
            started: "Started at",
            pingValue: "{%ping%} ms"
        },
        clear: {
            cleared: "Cleared **\`{%cleared%}\`** message(s).",
            skipped: `${emoji.yellowPoint.string} Messages that are more than 2 weeks old have been skipped due to Discord restrictions.`,
            pinned: `${emoji.yellowPoint.string} Pinned messages have been skipped.`,
            notFound: "No messages found to clear.",
            usage: "<count> [@Member | ID | bots | members]",
            description: `Delete amount of messages, excluding pinned messages.\n` +
                `Max amount per call — \`${ClearCommand.maxDeleteCount}\`.`,
            examples: [
                {
                    usage: "25",
                    description: "Delete last 25 messages."
                },
                {
                    usage: "50 @Member",
                    description: "Delete only specified member's messages from the last 50 messages."
                },
                {
                    usage: "100 bots",
                    description: "Delete only bots' messages from the last 100 messages."
                }
            ]
        },
        slowmode: {
            setToNumber: "Slowmode has been set to **\`{%time%}\`**.",
            disabled: "Slowmode has been disabled for this channel.",
            description: "Enables slowmode in the current channel (timeout for sending messages per user).\n" +
                `Max amount — 6 hours.\n` +
                "Enter \`0\` to disable.",
            usage: "<seconds>",
            examples: [
                {
                    usage: "60s",
                    description: "Set 60 seconds timeout for sending messages per user."
                },
                {
                    usage: "0",
                    description: "Disable slowmode."
                }
            ]
        },
        emoji: {
            notAnEmoji: "It doesn't look like an emoji.",
            description: "Gets description and image of specified emoji.",
            usage: "<emoji | ID>"
        },
        petpet: {
            description: "Creates a gif-animation with petting specified user's avatar.",
            usage: "[@Member | ID]",
            sad: "It's so sad when nobody else pets you :("
        },
        triggered: {
            description: "Creates a gif-animation with 'triggered' animation on attached image / image from URL.\n\n" +
                `Allowed domains: ${TriggeredCommand.allowedImageDomains.map(e => inlineCode(e)).join(", ")}\n` +
                `Allowed extensions: ${TriggeredCommand.allowedImageExtensions.map(e => inlineCode(e)).join(", ")}\n` +
                `Max size: \`${prettyBytes(TriggeredCommand.maxImageFileByteLength)}\`\n` +
                `Max width: \`${TriggeredCommand.maxImageSize.width} px\` | Max height: \`${TriggeredCommand.maxImageSize.height} px\``,
            usage: "<URL | Attachment>",
        },
        mute: {
            successResponse: "Following members have been muted:",
            nobody: "Nobody was muted. Maybe you've done something wrong.",
            calledCommand: "A command was called.",
            description: "Gives a mute to specified member(s).",
            usage: "<@Member | ID, [@Member | ID, [...]]> [duration] [reason]",
            examples: [
                {
                    usage: "@Member",
                    description: "Give permanent mute to selected member."
                },
                {
                    usage: "@Member 7d",
                    description: "Give mute to selected member expiring in 7 days."
                },
                {
                    usage: "@Member 12h aggressive behaviour",
                    description: "Give mute to selected member with reason expiring in 12 hours."
                }
            ],
            muteRoleNotFound: "Role for mute not found. Please, configure it or enable manageable mute role toggle.",
            muteReason: "For infractions"
        },
        unmute: {
            unmuted: "{%user%} has been unmuted.",
            notMuted: "{%user%} doesn't have mute.",
            description: "Removes mute from specified member.",
            usage: "<@Member | ID> [reason]",
            examples: [
                {
                    usage: "345980126820958210 amnesty",
                    description: "Unmute member with specified reason."
                }
            ]
        },
        support: {
            description: "Get invite link to the support server.",
        },
        emptychat: {
            description: "Sends a long empty message which makes the chat look cleaner.",
        },
        fox: {
            description: "Gets random fox image.",
        },
        server: {
            description: "Sends a detailed information about the server",
            name: "Name",
            owner: "Owner",
            modLvl: "Moderation level",
            created: "Created at",
            undefined: "Unknown"
        },
        math: {
            description: "Calculates the value of an expression.",
            error: "An error occurred while evaluating the expression \`{%expr%}\`:"
        }
    },
    event: {
        channelCreate: {
            description: "Logged whenever a channel is created"
        },
        channelDelete: {
            description: "Logged whenever a channel is deleted"
        },
        channelPinsUpdate: {
            description: "Logged whenever the pins of a channel are updated"
        },
        channelUpdate: {
            description: "Logged whenever a channel is updated - e.g. name change, topic change, channel type change"
        },
        emojiCreate: {
            description: "Logged whenever a custom emoji is created in a server"
        },
        emojiDelete: {
            description: "Logged whenever a custom emoji is deleted in a server"
        },
        emojiUpdate: {
            description: "Logged whenever a custom emoji is updated in a server"
        },
        guildBanAdd: {
            description: "Logged whenever a member is banned from a server"
        },
        guildBanRemove: {
            description: "Logged whenever a member is unbanned from a server"
        },
        guildIntegrationsUpdate: {
            description: "Logged whenever a server integration is updated"
        },
        guildMemberAdd: {
            description: "Logged whenever a user joins a server"
        },
        guildMemberRemove: {
            description: "Logged whenever a member leaves a server, or is kicked"
        },
        guildMemberUpdate: {
            description: "Logged whenever a server member changes - i.e. new role, removed role, nickname"
        },
        guildUpdate: {
            description: "Logged whenever a server is updated - e.g. name change"
        },
        inviteCreate: {
            description: "Logged when an invite is created"
        },
        inviteDelete: {
            description: "Logged when an invite is deleted"
        },
        messageDelete: {
            description: "Logged whenever a message is deleted"
        },
        messageDeleteBulk: {
            description: "Logged whenever messages are deleted in bulk"
        },
        messageReactionRemoveAll: {
            description: "Logged whenever all reactions are removed from a cached message"
        },
        messageUpdate: {
            description: "Logged whenever a message is updated - e.g. embed or content change"
        },
        roleCreate: {
            description: "Logged whenever a role is created"
        },
        roleDelete: {
            description: "Logged whenever a server role is deleted"
        },
        roleUpdate: {
            description: "Logged whenever a server role is updated"
        },
        voiceStateUpdate: {
            description: "Logged whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes"
        },
        webhookUpdate: {
            description: "Logged whenever a server text channel has its webHooks changed"
        },
        stickerCreate: {
            description: "Logged whenever a custom sticker is added"
        },
        stickerDelete: {
            description: "Logged whenever a custom sticker is deleted"
        },
        stickerUpdate: {
            description: "Logged whenever a custom sticker is updated - e.g. name, related emoji, description"
        },
        threadCreate: {
            description: "Logged whenever a thread is created"
        },
        threadDelete: {
            description: "Logged whenever a thread is deleted"
        },
        threadUpdate: {
            description: "Logged whenever a thread is updated - e.g. name change, archive state change, locked state change"
        }
    },
    eventLogger: {
        keyword: {
            channel: "Channel",
            name: "Name",
            type: "Type",
            position: "Position",
            emoji: "Emoji",
            animated: "Animated",
            tag: "Tag",
            user: "User",
            member: "Member",
            nickname: "Nickname",
            registered: "Registered",
            role: "Role",
            roles: "Roles",
            accountAge: "Account age",
            reason: "Reason",
            old: "Old",
            new: "New",
            nameUpdate: "Name Update",
            added: "Added",
            removed: "Removed",
            all: "All",
            none: "None",
            permissions: "Permissions",
            allow: "Allow",
            deny: "Deny",
            viewConnect: "View / Connect",
            viewRead: "View / Read",
            invite: "Invite",
            never: "Never",
            link: "Link",
            author: "Author",
            createdAt: "Created at",
            message: "Message",
            color: "Color",
            hoist: "Hoist",
            managed: "Managed",
            mentionable: "Mentionable",
            voiceChannel: "Voice Channel",
            webhook: "WebHook",
            executor: "Executor",
            clickMessage: "💬 Click"
        },
        channelCreate: {
            name: "Channel Create",
            description: "Channel has been created"
        },
        channelDelete: {
            name: "Channel Delete",
            description: "Channel has been deleted"
        },
        channelPinsUpdate: {
            name: "Channel Pins Update",
            description: "Channel pinned messages have been updated"
        },
        channelUpdate: {
            name: "Channel Update",
            description: "Channel has been updated",
            topic: "Topic Update",
            nsfw: "NSFW Update",
            coolDown: "CoolDown Update",
            bitrate: "Bitrate Update",
            userLimit: "User Limit Update",
            permissions: "Permissions Update",
            permissionsDesc: "Permissions have been updated",
            enabled: "Enabled",
            disabled: "Disabled"
        },
        emojiCreate: {
            name: "Emoji Create",
            description: "Emoji has been added"
        },
        emojiDelete: {
            name: "Emoji Delete",
            description: "Emoji has been deleted"
        },
        emojiUpdate: {
            name: "Emoji update",
            description: "Emoji has been updated"
        },
        guildBanAdd: {
            name: "Ban Add",
            description: "Member has been banned",
            bannedUser: "Banned User"
        },
        guildBanRemove: {
            name: "Ban Remove",
            description: "Member has been unbanned",
            unbannedUser: "Unbanned User"
        },
        guildIntegrationsUpdate: {
            updateName: "Guild Integrations Update",
            createName: "Guild Integrations Create",
            deleteName: "Guild Integrations Delete",
            updateDescription: "Integrations have been updated",
            createDescription: "Integrations have been created",
            deleteDescription: "Integrations have been deleted"
        },
        guildMemberAdd: {
            memberJoinName: "Member Join",
            memberJoinDescription: "Member has joined the server",
            botAddName: "Bot Add",
            botAddDescription: "Bot has been added to the server"
        },
        guildMemberRemove: {
            memberKickName: "Member Kick",
            memberKickDescription: "Member has been kicked from the server",
            memberLeaveName: "Member Leave",
            memberLeaveDescription: "Member has left the server",
            botKickName: "Bot Kick",
            botKickDescription: "Bot has been kicked from the server"
        },
        guildMemberUpdate: {
            name: "Member Update",
            description: "Member has been updated"
        },
        guildUpdate: {
            name: "Guild Update",
            description: "Guild has been updated",
            afkChannelUpdate: "AFK Channel Update",
            afkTimeoutUpdate: "AFK Timeout Update",
            bannerUpdate: "Banner Update",
            notificationsUpdate: "Notifications Update",
            discoverySplashUpdate: "Discovery Splash Update",
            descriptionUpdate: "Description Update",
            explicitFilterUpdate: "Explicit Filter Update",
            mfaLevelUpdate: "MFA level Update",
            nameUpdate: "Name Update",
            iconUpdate: "Icon Update",
            ownerUpdate: "Owner Update",
            partnerStatusUpdate: "Partner Status Update",
            preferredLocaleUpdate: "Preferred Locale Update",
            publicUpdatesChannelUpdate: "Public Updates Channel Update",
            regionUpdate: "Region Update",
            rulesChannelUpdate: "Rules Channel Update",
            splashUpdate: "Splash Update",
            systemChannelUpdate: "System Channel Update",
            systemChannelFlagsUpdate: "System Channel Flags Update",
            verificationLevelUpdate: "Verification Level Update",
            verifiedStatusUpdate: "Verified Status Update",
            widgetChannelUpdate: "Widget Channel Update",
            widgetToggleUpdate: "Widget Toggle Update"
        },
        inviteCreate: {
            name: "Invite Create",
            description: "Invite link has been created",
            expiresAt: "Expires at",
            maxAge: "Max age",
            maxUses: "Max uses",
            temporary: "Temporary"
        },
        inviteDelete: {
            name: "Invite Delete",
            description: "Invite link has been deleted"
        },
        messageDelete: {
            name: "Message Delete",
            description: "Message has been deleted",
            content: "Content",
            attachment: "Attachment",
            pinned: "Pinned",
            webhookID: "Webhook ID",
            embeds: "Embeds",
            reactions: "Reactions",
            createdAt: "Sent at"
        },
        messageDeleteBulk: {
            name: "Message Delete Bulk",
            description: "Messages **({%count%})** have been deleted bulk"
        },
        messageReactionRemoveAll: {
            name: "Message Reactions Remove All",
            description: "All message reactions have been removed"
        },
        messageUpdate: {
            name: "Message Update",
            description: "Message has been updated",
            newContent: "New Content",
            oldContent: "Old Content"
        },
        roleCreate: {
            name: "Role Create",
            description: "Role has been created"
        },
        roleDelete: {
            name: "Role Delete",
            description: "Role has been deleted"
        },
        roleUpdate: {
            name: "Role Update",
            description: "Role has been updated"
        },
        voiceChannelJoin: {
            name: "Voice Channel Join",
            description: "Member has joined voice channel",
        },
        voiceChannelLeave: {
            name: "Voice Channel Leave",
            description: "Member has left voice channel"
        },
        voiceChannelSwitch: {
            name: "Voice Channel Switch",
            description: "Member has switched to another voice channel",
            newVoiceChannel: "New Voice Channel",
            oldVoiceChannel: "Old Voice Channel"
        },
        voiceStateUpdate: {
            name: "Voice State Update",
            description: "Voice state has been updated",
            memberMute: "Member has been **muted** in voice channel",
            memberUnmute: "Member has been **unmuted** in voice channel",
            memberDefeat: "Member has been **defeated** in voice channel",
            memberUndefeat: "Member has been **undefeated** in voice channel",
        },
        webhookUpdate: {
            webhookCreateName: "WebHook Create",
            webhookCreateDescription: "Channel webhook has been created",
            webhookDeleteName: "WebHook Delete",
            webhookDeleteDescription: "Channel webhook has been deleted",
            webhookUpdateName: "WebHook Update",
            webhookUpdateDescription: "Channel webhook has been updated",
            nameUpdate: "Name Update",
            avatarUpdate: "Avatar Update",
            channelUpdate: "Channel Update",
            token: "Token",
            owner: "Owner",
        },
        stickerCreate: {
            name: "Sticker Create",
            description: "Sticker has been added"
        },
        stickerDelete: {
            name: "Sticker Delete",
            description: "Sticker has been removed"
        },
        stickerUpdate: {
            name: "Sticker Update",
            description: "Sticker has been updated"
        },
        threadCreate: {
            name: "Thread Create",
            description: "Thread has been created"
        },
        threadDelete: {
            name: "Thread Delete",
            description: "Thread has been deleted"
        },
        threadUpdate: {
            name: "Thread Update",
            description: "Thread has been updated"
        }
    },
    permission: {
        ADMINISTRATOR: "Administrator",
        CREATE_INSTANT_INVITE: "Create invites",
        KICK_MEMBERS: "Kick members",
        BAN_MEMBERS: "Ban members",
        MANAGE_CHANNELS: "Manage channels",
        MANAGE_GUILD: "Manage guild",
        ADD_REACTIONS: "Add reactions",
        VIEW_AUDIT_LOG: "View audit log",
        PRIORITY_SPEAKER: "Voice priority",
        STREAM: "Streaming in voice channels",
        VIEW_CHANNEL: "View channel",
        SEND_MESSAGES: "Send messages",
        SEND_TTS_MESSAGES: "Send TTS messages",
        MANAGE_MESSAGES: "Manage messages",
        EMBED_LINKS: "Embed links",
        ATTACH_FILES: "Attach files",
        READ_MESSAGE_HISTORY: "Read message history",
        MENTION_EVERYONE: "Mention everyone",
        USE_EXTERNAL_EMOJIS: "Use external emojis",
        VIEW_GUILD_INSIGHTS: "View server insights",
        CONNECT: "Connect",
        SPEAK: "Speak",
        MUTE_MEMBERS: "Mute members",
        DEAFEN_MEMBERS: "Deafen members",
        MOVE_MEMBERS: "Move members",
        USE_VAD: "Use voice activity detection",
        CHANGE_NICKNAME: "Change nickname",
        MANAGE_NICKNAMES: "Manage nicknames",
        MANAGE_ROLES: "Manage roles",
        MANAGE_WEBHOOKS: "Manage webhooks",
        MANAGE_EMOJIS: "Manage emojis"
    },
    overwrite: {
        member: "Member",
        role: "Role"
    },
    misc: {
        welcomeMessage: "Hello! Thanks for adding me here!\n" +
            "Join our official Discord Server to get any information: {%url%}\n" +
            "Visit our dashboard to setup bot: {%url2%}\n" +
            "My default prefix is \`!\`\n\n" +
            "Use \`!help\` command to get necessary information\n",
        createMuteRoleReason: "A mute role was created"
    },
    presenceStatus: {
        online: `${emoji.status.online.string} Online`,
        offline: `${emoji.status.offline.string} Offline`,
        dnd: `${emoji.status.dnd.string} Do Not Disturb`,
        idle: `${emoji.status.idle.string} Idle`,
        streaming: `${emoji.status.streaming.string} Streaming`,
        unknown: `${emoji.status.unknown.string} Unknown`
    },
    activityType: {
        PLAYING: "Playing",
        STREAMING: "Streaming",
        LISTENING: "Listening",
        WATCHING: "Watching",
        CUSTOM_STATUS: "Custom status",
        COMPETING: "Competing"
    },
    subscription: {
        twitch: {
            live: `${emoji.twitch.string} **{%user%}** is live on Twitch`,
            game: "Game",
            watchNow: "Watch now",
            clickHere: "[\`*Click Here to watch stream*\`]({%url%})"
        },
    },
    verificationLevel: {
        NONE: "None",
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
        VERY_HIGH: "Very high"
    },
    rest: {
        page: "Page",
        notFound: "Data not found.",
        interactionExecutorError: "Only command executor can interact with it.",
        inputPageNumber: "Enter the page number (you have 10 seconds to answer).",
        inputPageWarning: "If you don't answer, Discord will show an error after a while, but the page will be changed.",
        interactionTimeout: "Interaction with this is no longer available (time expired). Please, call the command again.",
        dmModerationResponse: {
            warn: "You have been **warned** on the server",
            ban: "You have been **banned** from the server",
            kick: "You have been **kicked** from the server",
            mute: "You have been **muted** on the server"
        }
    }
};

export default en_US;
