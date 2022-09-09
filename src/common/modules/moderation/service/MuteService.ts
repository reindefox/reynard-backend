import { Mute, MuteModel } from "@src/database/models/Mute";
import { createErrorLog } from "@src/scripts/Logger";
import { MuteModerationActionRequest } from "@src/common/modules/moderation/interfaces/ModerationActionRequest";
import { BaseModerationService } from "@src/common/modules/moderation/service/BaseModerationService";
import {
    Guild,
    GuildMember,
    HexColorString,
    OverwriteResolvable,
    PermissionOverwrites,
    Permissions,
    Role,
    TextChannel,
    VoiceChannel
} from "discord.js";

export class MuteService extends BaseModerationService {
    private static readonly muteRoleName: string = "Muted";
    private static readonly muteRoleColor: HexColorString = "#707070";

    private muteRole: Role;

    public async muteMember(moderationActionRequest: MuteModerationActionRequest): Promise<void> {
        let muteRole: Role = await this.getMuteRole();

        if (!muteRole) {
            throw new Error("MANAGEABLE_MUTE_ROLE");
        }

        if (muteRole.position > moderationActionRequest.member.guild.me.roles.highest.position) {
            muteRole = await this.createRole();
        }

        const muteWrite: MuteModel = await Mute.findOne({
            where: {
                userID: moderationActionRequest.member.id,
                guildID: moderationActionRequest.member.guild.id
            }
        });

        if (!muteWrite) {
            await Mute.create({
                userID: moderationActionRequest.member.id,
                invokerID: moderationActionRequest.invoker.id,
                guildID: moderationActionRequest.member.guild.id,
                reason: moderationActionRequest.reason,
                timestamp: Math.floor(new Date().getTime() / 1000),
                duration: moderationActionRequest.duration,
                muteRoleID: muteRole.id
            });
        } else {
            muteWrite.timestamp = Math.floor(new Date().getTime() / 1000);
            muteWrite.duration = moderationActionRequest.duration;
            muteWrite.muteRoleID = muteRole.id;
            await muteWrite.save();
        }

        if (!moderationActionRequest.member.roles.cache.has(muteRole.id)) {
            await moderationActionRequest.member.roles.add(muteRole, moderationActionRequest.reason)
                .catch(e => createErrorLog(e, __filename));
        }
    }

    public async restoreMute(member: GuildMember): Promise<void> {
        const muteRole: Role = await this.getMuteRole();

        if (!muteRole) {
            return;
        }

        if (!member.roles.cache.has(muteRole.id)) {
            await member.roles.add(muteRole)
                .catch(e => createErrorLog(e, __filename));
        }
    }

    private async createRoleIfNotExists(): Promise<Role> {
        let muteRole: Role = this.guild.roles.cache.get(this.guildDaoManager.model.muteRoleID);

        if (!muteRole) {
            muteRole = await this.createRole();
        } else {
            if (this.guildDaoManager.model.manageableMuteRole) {
                void this.overrideChannelPermissions(muteRole);
            }
        }

        return this.muteRole = muteRole;
    }

    private async createRole(): Promise<Role> {
        if (!this.guildDaoManager.model.manageableMuteRole) {
            return;
        }

        const muteRole: Role = await this.guild.roles.create({
            name: MuteService.muteRoleName,
            color: MuteService.muteRoleColor,
            reason: this.guildDaoManager.localeService.languageRecord.misc.createMuteRoleReason
        })
            .catch(e => createErrorLog(e, __filename));

        if (!muteRole) {
            return null;
        }

        this.guildDaoManager.model.muteRoleID = muteRole.id;
        await this.guildDaoManager.model.save();

        if (this.guildDaoManager.model.manageableMuteRole) {
            void this.overrideChannelPermissions(muteRole);
        }

        return this.muteRole = muteRole;
    }

    private async overrideChannelPermissions(muteRole: Role): Promise<void> {
        const textChannels: TextChannel[] | VoiceChannel[] = <TextChannel[] | VoiceChannel[]>this.guild.channels.cache
            .filter(c => c instanceof TextChannel || c instanceof VoiceChannel)
            .map(c => c);

        if (!textChannels || textChannels.length === 0) {
            return;
        }

        await MuteService.overrideMuteChannelPermissions(textChannels, muteRole);
    }

    public static async overrideMuteChannelPermissions(channels: TextChannel[] | VoiceChannel[], muteRole: Role): Promise<void> {
        if (!channels || channels.length === 0) {
            return;
        }

        for (const channel of channels) {
            const permissionOverwrites: PermissionOverwrites[] = channel.permissionOverwrites.cache
                .map(p => p);

            const muteRolePermissions: PermissionOverwrites = permissionOverwrites
                .filter(r => r.id === muteRole.id)![0];

            if (!muteRolePermissions) {
                continue;
            }

            if (permissionOverwrites.includes(muteRolePermissions)) {
                continue;
            }

            try {
                const newPermissions: OverwriteResolvable = {
                    id: muteRole.id,
                    deny: [
                        Permissions.FLAGS.SEND_MESSAGES,
                        Permissions.FLAGS.SPEAK
                    ]
                };

                if (muteRolePermissions?.allow) {
                    newPermissions.allow = muteRolePermissions.allow;
                }

                if (muteRolePermissions?.deny) {
                    newPermissions.deny = (<Permissions[]>newPermissions.deny)
                        .concat(muteRolePermissions.deny);
                }

                await channel.permissionOverwrites.set([
                    ...permissionOverwrites,
                    newPermissions
                ]);
            } catch (e) {
                createErrorLog(e, __filename);
            }
        }
    }

    public async getMuteRole(): Promise<Role> {
        if (this.muteRole) {
            return this.muteRole;
        }

        if (this.guildDaoManager.model.manageableMuteRole) {
            return this.createRoleIfNotExists();
        }

        return null;
    }

    public static unmuteMembers(mutes: MuteModel[], guild: Guild): void {
        for (const mute of mutes) {
            this.unmuteMember(mute, guild);
        }
    }

    public static unmuteMember(mute: MuteModel, guild: Guild): void {
        const member: GuildMember = guild.members.cache.get(mute.userID);

        if (!member) {
            return;
        }

        const muteRole: Role = guild.roles.cache.get(mute.muteRoleID);

        if (!muteRole) {
            return;
        }

        member.roles.remove([muteRole])
            .catch(() => null);

        mute.destroy()
            .catch(() => null);
    }
}
