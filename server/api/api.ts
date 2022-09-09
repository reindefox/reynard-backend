import { ReynardApiWorker } from "@server/api/structures/ReynardApiWorker";
import { config } from "@src/structures/Application";
import { createErrorLog } from "@src/scripts/Logger";

export class API {
    private static api: API;

    protected constructor() {
    }

    public async init(): Promise<void> {
        const reynardApiWorker: ReynardApiWorker = new ReynardApiWorker({
            ip: config.api.server.host,
            port: config.api.server.port,
        });

        await reynardApiWorker.start()
            .catch(e => createErrorLog(e, __filename));
    }

    public static get instance(): API {
        if (!this.api) {
            this.api = new API();
        }

        return this.api;
    }
}
