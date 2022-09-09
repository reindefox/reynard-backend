import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { Ban, BanModel } from "@src/database/models/Ban";
import { Mute, MuteModel } from "@src/database/models/Mute";
import { MuteService } from "@src/common/modules/moderation/service/MuteService";
import { GuildMember } from "discord.js";

export default class GuildMemberAddEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "guildMemberAdd",
        name: "event.guildMemberAdd.name",
        category: "event.category.guild"
    };

    constructor() {
        super(GuildMemberAddEvent.options);
    }

    public async run(member: GuildMember): Promise<void> {
        if (!member) return;
        if (member.id === this.client.user.id) return;

        await this.initialize(member.guild, ...arguments);

        const ban: BanModel = await Ban.findOne({
            where: {
                guildID: member.guild.id,
                userID: member.id
            }
        });

        if (ban) {
            await ban.destroy();
        }

        const mute: MuteModel = await Mute.findOne({
            where: {
                guildID: member.guild.id,
                userID: member.id
            }
        });

        if (mute) {
            if (mute.duration !== null && mute.duration + mute.timestamp < Math.floor(new Date().getTime() / 1000)) {
                await mute.destroy();
            } else {
                const muteService: MuteService = new MuteService(member.guild, this.guildDaoManager);

                await muteService.restoreMute(member);
            }
        }
    }
}
