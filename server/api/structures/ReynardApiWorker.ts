import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "@server/api/modules/app.module";
import { config } from "@src/structures/Application";
import FastifyCors from "fastify-cors"

export class ReynardApiWorker {
    private readonly _ip: string;
    private readonly _port: number;

    private nestApp: NestFastifyApplication;

    public static readonly baseAddress: string = config.api.webUrl;

    constructor(private readonly data: WorkerStructure) {
        this._ip = data.ip;
        this._port = data.port;
    }

    public async start(): Promise<boolean> {
        const appModule: typeof AppModule = (await import("../modules/app.module")).AppModule;

        this.nestApp = await NestFactory.create<NestFastifyApplication>(
            appModule,
            new FastifyAdapter()
        );

        this.nestApp.setGlobalPrefix("api");

        this.nestApp.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            // forbidNonWhitelisted: true
        }));

        await this.nestApp.register(FastifyCors, {
            origin: true
        });

        return new Promise((resolve, reject) => {
            this.nestApp.listen(this.port, this.ip, (error: Error, address: string) => {
                if (error) {
                    console.log(`* Failed to start API server`);
                    resolve(false);
                } else {
                    console.log(`- API server is running on ${this.port}`);
                    resolve(true);
                }
            });
        });
    }

    public get ip(): string {
        return this._ip;
    }

    public get port(): number {
        return this._port;
    }
}

interface WorkerStructure {
    ip: string;
    port: number;
}
