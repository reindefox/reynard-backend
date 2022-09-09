import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { CommandConfigModel } from "@src/database/models/CommandConfig";
import { GuildModel } from "@src/database/models/Guild";
import { AbstractLocaleService } from "@src/services/abstract/AbstractLocaleService";
import { Message, PermissionResolvable } from "discord.js";

export interface AbstractCommandConstructor {
    options: CommandOptions;

    call(message: Message, args?: string[]): Promise<void>;
}

export interface CommandConstructor extends AbstractCommandConstructor {
    new(commandData: CommandData, options: CommandOptions);
}

export interface CommandOptions {
    name: string;
    group: string;
    description: string;
    usage: string;
    examples: string[];
    guildOnly: boolean;
    dmOnly: boolean;
    developerOnly: boolean;
    ownerOnly: boolean;
    nsfwOnly: boolean;
    clientPermissions: PermissionResolvable[];
    memberPermissions: PermissionResolvable[];
    memberEveryPermission: boolean;
    typing: boolean;
    selfMention: boolean;
    ignoreMentionGuildRule: boolean;
}

export interface CommandData {
    message: Message;
    args: string[];
    command: CommandConstructor;
    guildData: GuildModel;
    guildDaoManager: GuildDaoManager;
    localeService: AbstractLocaleService;
    commandConfig: CommandConfigModel;
}
