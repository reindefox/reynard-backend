import { Injectable } from "@nestjs/common";
import { Cron, Timeout } from "@nestjs/schedule";
import StatsCommand from "@src/global/commands/information/StatsCommand";

@Injectable()
export class TaskService {
    @Timeout(0)
    @Cron("*/15 * * * *")
    public async handleClientValues(): Promise<void> {
        await StatsCommand.fetchClientShardValues();
    }
}
