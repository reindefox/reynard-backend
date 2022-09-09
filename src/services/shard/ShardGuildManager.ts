import { Application, config } from "@src/structures/Application";
import { ShardUtils } from "@src/utils/ShardUtils";
import { Channel, Guild, GuildEmoji, GuildMember, Role, Shard, Snowflake, Webhook } from "discord.js";

export class ShardGuildManager {
    public readonly shard: Shard;

    constructor(public readonly guildID: Snowflake) {
        this.shard = Application.shardingManager.shards.get(ShardUtils.getShardID(guildID));
    }

    public async fetchGuild(): Promise<Partial<Guild>> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}");
        `);
    }

    public async fetchMember(userID: Snowflake): Promise<Partial<GuildMember> & { hasAccessPermission: boolean }> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}")?.members?.fetch("${userID}", {force: true})
                ?.then(m => {
                    return {
                        ...m,
                        hasAccessPermission: m.permissions.has("ADMINISTRATOR") || m.user.id === m.guild.owner?.user?.id
                    };
                })
                ?.catch(() => {
                    return null;
                });
        `);
    }

    public async fetchClient(): Promise<Partial<GuildMember>> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}")?.members?.fetch("${config.client.user.id}", {force: true})
                ?.then(c => {
                    return {
                        ...c
                    };
                })
                ?.catch(() => {
                    return null;
                });
        `);
    }

    public async fetchWebhooks(): Promise<Partial<Webhook[]> & { icon: string }[]> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}")?.fetchWebhooks()
                ?.then(w => {
                    return w.filter(e => e.type === "Incoming" && e.token)
                        ?.map(e => {
                            e.icon = e.avatarURL();
                            return e;
                        })
                        ?.sort((a, b) => a.name > b.name ? 1 : -1) || [];
                })
                ?.catch(() => {
                    return null;
                });
        `);
    }

    public async fetchRoles(): Promise<Partial<Role[]>> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}")?.roles?.cache
                ?.filter(e => e.name !== "@everyone"
                    && !e.managed
                    && e.name !== e.guild.me.roles.highest.name)
                .map(e => {
                    e.available = e.position < e.guild.me.roles.highest.position
                    return e;
                })
                .sort((a, b) => {
                    if (a.position > b.position) {
                        return 1;
                    } else if (a.position < b.position) {
                        return -1;
                    }
                });
        `);
    }

    public async fetchChannels(): Promise<Partial<Channel[]>> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}")?.channels?.cache?.map(c => c);
        `);
    }

    public async fetchMembers(): Promise<Partial<GuildMember[]>> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}")?.members?.cache?.map(m => m);
        `);
    }

    public async fetchEmojis(): Promise<Partial<GuildEmoji[]>> {
        // language=JavaScript
        return <any>this.shard.eval(`
            BigInt.prototype.toJSON = function () {
                return this.toString();
            };

            this.guilds.cache.get("${this.guildID}")?.emojis?.cache?.map(e => e);
        `);
    }

    public async createGuildStructure(): Promise<Partial<Guild>> {
        return null;
    }
}
