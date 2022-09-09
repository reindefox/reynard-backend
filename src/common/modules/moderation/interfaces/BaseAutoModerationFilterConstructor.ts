import { PunishmentType } from "@src/common/abstractions/command/model/AbstractModerationCommand";
import { Snowflake } from "discord.js";

export interface BaseAutoModerationFilterConstructor {
    deleteSourceMessage: boolean,
    punishmentType: PunishmentType,
    ignoreRoot: boolean,
    allowedRoles: Snowflake[],
    ignoredRoles: Snowflake[],
    allowedChannels: Snowflake[],
    ignoredChannels: Snowflake[],
    allowedMembers: Snowflake[],
    ignoredMembers: Snowflake[]
}
