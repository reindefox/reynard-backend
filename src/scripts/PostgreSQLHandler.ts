import { config } from "@src/structures/Application";
import pg from "pg";
import { Sequelize } from "sequelize";

export class PostgreSQL {
    private static _postgreSQL: PostgreSQL = null;

    private readonly _client: pg.Client = null;

    private readonly _sequelize: Sequelize = null;

    protected constructor() {
        this._sequelize = new Sequelize(config.database.connectionUrl, {
            define: {
                timestamps: false,
            },
            logging: false
        });
    }

    public async sequelizeAuthenticate(): Promise<void> {
        try {
            await this._sequelize.authenticate();
            console.log("- PostgreSQL has been connected");
        } catch (e) {
            console.log("Failed to create PostgreSQL connection:", e);
        }
    }

    public get sequelize(): Sequelize {
        return this._sequelize;
    }

    public get client(): pg.Client {
        return this._client;
    }

    public static closeConnection(): void {
        void this._postgreSQL._sequelize.close();
    }

    public static get instance(): PostgreSQL {
        if (PostgreSQL._postgreSQL === null) {
            PostgreSQL._postgreSQL = new PostgreSQL();
        }
        return PostgreSQL._postgreSQL;
    }
}
