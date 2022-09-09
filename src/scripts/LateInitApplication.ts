import { TwitchPosting } from "@src/api/subscriptions/twitch/TwitchPosting";
import { ApplicationTaskManager } from "@src/services/ApplicationTaskManager";
import { Application } from "@src/structures/Application";

export class LateInitApplication {
    public static async lateInit(): Promise<void> {
        Application.twitchPosting = new TwitchPosting();

        await ApplicationTaskManager.start();
    }
}
