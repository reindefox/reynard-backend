import StatsCommand from "@src/global/commands/information/StatsCommand";
import { Reynard } from "@src/structures/Reynard";
import * as cron from "cron";

export class ClientTaskManager {
    public static async loadOnInitialization(): Promise<void> {
    }

    public static async loadOnReady(client: Reynard): Promise<void> {
        /* Wait for API starts and get values */
        setTimeout(async () => {
            await StatsCommand.fetchClientValues();
        }, 15000);

        /** Every 15 minutes */
        new cron.CronJob("*/15 * * * *", async () => {
            await StatsCommand.fetchClientValues();
        }).start();
    }
}
