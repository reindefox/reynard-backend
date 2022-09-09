import { GuildManageCommandDto } from "@server/api/dto/private/guildManage/guild-manage-command.dto";
import { AbstractDao } from "@src/database/dao/abstractions/AbstractDao";
import { CommandConfig, CommandConfigModel } from "@src/database/models/CommandConfig";
import { Snowflake } from "discord.js";

export class CommandDao extends AbstractDao {
    public static async updateConfig(guildID: Snowflake, dto: GuildManageCommandDto): Promise<boolean> {
        return new Promise((resolve, reject) => {
            CommandConfig.findOrCreate({
                where: {
                    guildID: guildID,
                    key: dto.key
                },
                defaults: {
                    guildID: guildID,
                    // Use this way if whitelist is enabled and we're sure that no other properties will be included
                    ...dto
                }
            })
                .then(async (e: [CommandConfigModel, boolean]) => {
                    // If nothing was created as there's already exists one
                    if (!e[1]) {
                        const commandConfig: CommandConfigModel = e[0];

                        commandConfig.key = dto.key;
                        commandConfig.toggle = dto.toggle;
                        commandConfig.delSrcMsg = dto.delSrcMsg;
                        commandConfig.hidden = dto.hidden;
                        commandConfig.nsfwOnly = dto.nsfwOnly;
                        commandConfig.coolDown = dto.coolDown;
                        commandConfig.ignoredRoles = dto.ignoredRoles;
                        commandConfig.allowedRoles = dto.allowedRoles;
                        commandConfig.ignoredChannels = dto.ignoredChannels;
                        commandConfig.allowedChannels = dto.allowedChannels;
                        commandConfig.ignoredMembers = dto.ignoredMembers;
                        commandConfig.allowedMembers = dto.allowedMembers;

                        await commandConfig.save();
                    }

                    resolve(true);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}
