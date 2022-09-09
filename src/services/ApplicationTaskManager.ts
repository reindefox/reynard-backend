import { Ban, BanModel } from "@src/database/models/Ban";
import { BaseDataModel } from "@src/database/models/base/BaseDataModel";
import { Mute, MuteModel } from "@src/database/models/Mute";
import { SlowMode, SlowModeModel } from "@src/database/models/SlowMode";
import { Warn, WarnModel } from "@src/database/models/Warn";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { Application } from "@src/structures/Application";
import { ShardUtils } from "@src/utils/ShardUtils";
import * as cron from "cron";
import { Shard } from "discord.js";
import { ModelCtor } from "sequelize/types/lib/model";

export class ApplicationTaskManager {
    public static async start(): Promise<void> {
        new cron.CronJob("* * * * *", async () => {
            await Application.twitchPosting.attachToSchedule();
        }).start();

        new cron.CronJob("* * * * *", async () => {
            const mutes: MuteModel[] = await this.getFilteredData<MuteModel>(Mute, Mute.tableName);

            for (const mute of mutes) {
                if (!mute) {
                    continue;
                }

                const shard: Shard = Application.shardingManager.shards.get(ShardUtils.getShardID(mute.guildID));

                if (!shard) {
                    continue;
                }

                // language=JavaScript
                await shard.eval(`
                    (() => {
                        const guild = this.guilds.cache.get("${mute.guildID}");

                        if (!guild) {
                            return;
                        }

                        const member = guild.member("${mute.userID}");

                        if (!member) {
                            return;
                        }

                        const muteRole = guild.roles.cache.get("${mute.muteRoleID}");

                        if (!muteRole) {
                            return;
                        }

                        member.roles.remove([muteRole])
                            .catch(() => null);

                        return null;
                    })();
                `)
                    .catch(() => null);

                mute.destroy()
                    .catch(() => null);
            }

            const bans: BanModel[] = await this.getFilteredData<BanModel>(Ban, Ban.tableName);

            for (const ban of bans) {
                if (!ban) {
                    continue;
                }

                const shard: Shard = Application.shardingManager.shards.get(ShardUtils.getShardID(ban.guildID));

                if (!shard) {
                    continue;
                }

                // language=JavaScript
                await shard.eval(`
                    (() => {
                        const guild = this.guilds.cache.get("${ban.guildID}");

                        if (!guild) {
                            return;
                        }

                        guild.members.unban(ban.userID)
                            .catch(() => null);
                    })();
                `)
                    .catch(() => null);

                ban.destroy()
                    .catch(() => null);
            }

            const warns: WarnModel[] = await this.getFilteredData<WarnModel>(Warn, Warn.tableName);

            for (const warn of warns) {
                if (!warn) {
                    continue;
                }

                warn.destroy()
                    .catch(() => null);
            }

            const slowModes: SlowModeModel[] = await this.getFilteredData<SlowModeModel>(SlowMode, SlowMode.tableName);

            for (const slowMode of slowModes) {
                if (!slowMode) {
                    continue;
                }

                const shard: Shard = Application.shardingManager.shards.get(ShardUtils.getShardID(slowMode.guildID));

                if (!shard) {
                    continue;
                }

                // language=JavaScript
                await shard.eval(`
                    (() => {
                        const guild = this.guilds.cache.get("${slowMode.guildID}");

                        if (!guild) {
                            return;
                        }

                        const channel = guild.channels.cache.get("${slowMode.channelID}");

                        if (!channel) {
                            return;
                        }

                        channel.setRateLimitPerUser(0)
                            .catch(() => null);
                    })();
                `)
                    .catch(() => null);

                slowMode.destroy()
                    .catch(() => null);
            }
        }).start();
    }

    private static async getFilteredData<T extends BaseDataModel>(model: ModelCtor<T>, tableName: string): Promise<T[]> {
        const timestamp: number = Math.floor(new Date().getTime() / 1000);

        // language=SQL
        return PostgreSQL.instance.sequelize.query("SELECT * FROM " + tableName + " WHERE duration IS NOT NULL AND duration + timestamp <= " + timestamp, {
            mapToModel: true,
            model: model
        });
    }
}
