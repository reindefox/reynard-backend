import { MomentService } from "@src/services/guild/MomentService";
import { PermissionResolvable, Permissions, Role } from "discord.js";
import moment from "moment";

export class FormatUtils {
    public static capitalizeFirstLetters(str: string): string {
        return str.replace(/(^|\s)\S/g, function (a: string) {
            return a.toUpperCase();
        });
    }

    public static formatContent(content: string): string {
        /** Delete all quotes (`) from content */
        return String(content).replace(/[`]/g, "'");
    }

    public static sliceContent(content: string, length: number): string {
        const stringContent: string = String(content);

        return stringContent.length > length ? `${stringContent.slice(0, length)}... (+${stringContent.length - length})` : stringContent.length > 0 ? stringContent : " ";
    }

    public static formatPermissions(permissions: PermissionResolvable[]): string[] {
        const returnedPermissions: string[] = [];

        for (let i in permissions) {
            if (permissions.hasOwnProperty(i)) {
                const permission = permissions[i].toString().toLowerCase().replace(/[_]/g, " ");
                returnedPermissions.push(FormatUtils.capitalizeFirstLetters(permission));
            }
        }

        return returnedPermissions.length > 0 ? returnedPermissions : ["global.none"];
    }

    public static formatRolePermissions(role: Role): string[] {
        const permissions: string[] = [];

        for (let flag in Permissions.FLAGS) {
            if (Permissions.FLAGS.hasOwnProperty(flag)) {
                if (role.permissions.has(Permissions.FLAGS[flag])) {
                    permissions.push(flag.toString().toLowerCase()
                        .replace(/[_]/g, " ")
                        .replace(/(^|\s)\S/g, function (a: string) {
                            return a.toUpperCase();
                        }));
                }
            }
        }

        return permissions;
    }

    public static formatFlag(flag: string): string {
        return FormatUtils.capitalizeFirstLetters(flag?.toLowerCase().replace(/[_]/g, " ") || "");
    }

    public static getUTCTime(args?: number): string {
        return `UTC ${moment(args).format(MomentService.defaultFormat)}`;
    }
}
