import { SearchChannels } from "@src/packages/twitchJS/interfaces/SearchChannels";
import TwitchJsOptions from "twitch-js";
import TwitchJs, { ApiVersions } from "twitch-js";

export class TwitchService {
    private static twitchService: TwitchService;

    public twitchClient: TwitchJsOptions;

    private constructor() {
        this.twitchClient = new TwitchJs({
            username: process.env.TWITCH_USERNAME,
            token: process.env.TWITCH_TOKEN,
            clientId: process.env.TWITCH_CLIENT_ID
        });

        this.createTwitchConnection(1);
    }

    private createTwitchConnection(attempts: number): void {
        if (attempts >= 3) {
            console.log("Failed to create twitch connection");

            return;
        }

        this.twitchClient.chat.connect()
            .then(() => console.log("- Twitch client has been connected"))
            .catch(() => {
                console.log("Failed to create twitch connection. Reconnecting...");

                setTimeout(() => {
                    this.createTwitchConnection(attempts++);
                }, 8000);
            });
    }

    public static get instance(): TwitchService {
        if (!this.twitchService) {
            this.twitchService = new TwitchService();
        }

        return this.twitchService;
    }

    /*
    * https://dev.twitch.tv/docs/v5/reference/search#search-channels
    * */
    public async searchChannels(query: string): Promise<SearchChannels> {
        return new Promise((resolve, reject) => {
            this.twitchClient.api.get(`search/channels?query=${query}`, {
                version: ApiVersions.Kraken
            })
                .then(r => {
                    resolve(r);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}
