import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { UserDto } from "@server/api/dto/oauth2/user.dto";
import { IsSnowflakeStatic } from "@server/api/validators/is-snowflake.validator";
import { createErrorLog } from "@src/scripts/Logger";
import { ShardGuildManager } from "@src/services/shard/ShardGuildManager";
import { Guild, GuildMember } from "discord.js";

@Injectable()
export class GuildAccessGuard implements CanActivate {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: any = context.switchToHttp().getRequest();

        if (!request.params?.id || request.params?.id === "") {
            throw new BadRequestException({
                message: "'id' is a required parameter."
            });
        }

        if (!IsSnowflakeStatic(request.params.id)) {
            throw new BadRequestException({
                message: "'id' must be a snowflake string."
            });
        }

        const data: { user: UserDto, authorization: string } = request.data;

        if (!data) {
            throw new BadRequestException({
                message: "Invalid data was specified."
            });
        }

        const shardGuildManager: ShardGuildManager = new ShardGuildManager(request.params.id);

        if (!shardGuildManager.shard) {
            throw new NotFoundException({
                message: "Server shard not found or not available for now."
            });
        }

        const guild: Partial<Guild> = await shardGuildManager.fetchGuild()
            .catch((e) => createErrorLog(e, __filename));

        if (!guild) {
            throw new NotFoundException({
                message: "Server not found in client cache."
            });
        }

        const client: Partial<GuildMember> = await shardGuildManager.fetchClient()
            .catch((e) => createErrorLog(e, __filename));

        if (!client) {
            throw new NotFoundException({
                message: "Client not found on the server."
            });
        }

        const member: Partial<GuildMember> & { hasAccessPermission: boolean } = await shardGuildManager.fetchMember(data.user.id)
            .catch((e) => createErrorLog(e, __filename));

        if (!member) {
            throw new NotFoundException({
                message: "Member with the specified id not found on the server."
            });
        }

        if (!member.hasAccessPermission) {
            throw new ForbiddenException({
                message: "You are neither an administrator nor server owner."
            });
        }

        request.data.shardGuildManager = shardGuildManager;
        request.data.shard = shardGuildManager.shard;
        request.data.guild = guild;
        request.data.client = client;
        request.data.member = member;

        return true;
    }
}
