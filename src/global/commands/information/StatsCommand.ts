import { emoji } from "@src/assets/json/emoji";
import { properties } from "@src/assets/json/properties";
import { CommandOptions } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractBaseCommand } from "@src/common/abstractions/command/model/AbstractBaseCommand";
import { MomentService } from "@src/services/guild/MomentService";
import { Application } from "@src/structures/Application";
import { LineStringBuilder } from "@src/utils/LineStringBuilder";
import axios, { AxiosResponse } from "axios";
import { Message, MessageEmbed } from "discord.js";

export default class StatsCommand extends AbstractBaseCommand {
    public static readonly options = <CommandOptions>{
        ...AbstractBaseCommand.options,
        name: "stats",
        group: "information",
        clientPermissions: [],
        memberPermissions: []
    };

    public static readonly clientStatistics = {
        guilds: 0,
        users: 0
    };

    protected async execute(message: Message, args: string[]): Promise<void> {
        await this.messageService.sendEmbedMessage(new MessageEmbed()
            .setAuthor(this.translate("command.stats.statistics", [this.client.user.username]))
            .setDescription(this.translate("command.stats.valuesUpdateCoolDown"))
            .setThumbnail(this.client.user.displayAvatarURL())
            .addField(this.translate("command.stats.common"), new LineStringBuilder()
                .addFieldLine(this.translate("command.stats.servers"), StatsCommand.clientStatistics.guilds.toString())
                .addFieldLine(this.translate("command.stats.users"), StatsCommand.clientStatistics.users.toString())
                .build(), true)
            .addField(this.translate("command.stats.client"), new LineStringBuilder()
                .addFieldLine(this.translate("command.stats.ping"),
                    this.translate("command.stats.pingValue", [this.client.ws.ping]))
                .addFieldLine(this.translate("command.stats.version"),
                    process.env.npm_package_version)
                .addFieldLine(this.translate("command.stats.started"),
                    this.moment(this.client.readyAt.getTime()).format(MomentService.defaultFormat))
                .build(), true)
            .addField(this.translate("command.stats.information"), new LineStringBuilder()
                .addFieldLine(this.translate("command.stats.writtenIn"), [emoji.ts.string].join(" "))
                .addFieldLine(this.translate("command.stats.devPage"), `[\`GitHub\`](${properties.developer.github})`)
                .build(), true
            ), true);
    }

    public static async fetchClientShardValues(): Promise<void> {
        const tempClientUsers: any[] = await Application.shardingManager.fetchClientValues("users.cache");
        const clientUsers: number = [...new Set(tempClientUsers.pop().map(u => u.id))].length;
        const clientGuilds: number = <number>(await Application.shardingManager.fetchClientValues("guilds.cache.size"))?.reduce((acc: number, guildCount: number) => acc + guildCount, 0);

        this.clientStatistics.users = clientUsers;
        this.clientStatistics.guilds = clientGuilds;
    }

    public static async fetchClientValues(): Promise<void> {
        const response: AxiosResponse<{
            guildCount: number,
            userCount: number
        }> = await axios.get("http://localhost:3000/api/public/status")
            .catch(() => null);

        if (response) {
            StatsCommand.clientStatistics.guilds = response.data.guildCount;
            StatsCommand.clientStatistics.users = response.data.userCount;
        }
    }
}
