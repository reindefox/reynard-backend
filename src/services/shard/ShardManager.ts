import { Snowflake, WebhookClient } from "discord.js";

export class ShardManager {
    public static fetchWebhook(webhookID: Snowflake, webhookToken: Snowflake): WebhookClient {
        return new WebhookClient({
            id: webhookID,
            token: webhookToken
        });
    }
}
