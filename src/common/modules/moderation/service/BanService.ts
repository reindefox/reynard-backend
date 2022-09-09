import { Ban, BanModel } from "@src/database/models/Ban";
import { BanModerationActionRequest } from "@src/common/modules/moderation/interfaces/ModerationActionRequest";
import { BaseModerationService } from "@src/common/modules/moderation/service/BaseModerationService";
import { Guild, GuildMember, Snowflake, User } from "discord.js";

export class BanService extends BaseModerationService {
    public async banMember(moderationActionRequest: BanModerationActionRequest): Promise<GuildMember | User | Snowflake> {
        const banWrite: BanModel = await Ban.findOne({
            where: {
                userID: moderationActionRequest.userID,
                guildID: moderationActionRequest.message.guild.id,
            }
        });

        if (!banWrite) {
            await Ban.create({
                userID: moderationActionRequest.userID,
                invokerID: moderationActionRequest.invoker.id,
                guildID: moderationActionRequest.message.guild.me,
                reason: moderationActionRequest.reason,
                timestamp: Math.floor(new Date().getTime() / 1000),
                duration: moderationActionRequest.duration
            });
        } else {
            banWrite.duration = moderationActionRequest.duration;
            banWrite.timestamp = Math.floor(new Date().getTime() / 1000);
            await banWrite.save();
        }

        return moderationActionRequest.message.guild.members.ban(moderationActionRequest.userID, {
            reason: moderationActionRequest.reason,
            days: moderationActionRequest.deleteDays
        });
    }

    public static unbanMembers(bans: BanModel[], guild: Guild): void {
        for (const ban of bans) {
            this.unbanMember(ban, guild);
        }
    }

    public static unbanMember(ban: BanModel, guild: Guild): void {
        guild.members.unban(ban.userID)
            .catch(() => null);

        ban.destroy()
            .catch(() => null);
    }
}
