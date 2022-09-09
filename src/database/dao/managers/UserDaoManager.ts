import { AbstractDaoManager } from "@src/database/dao/abstractions/AbstractDaoManager";
import { User, UserModel } from "@src/database/models/User";
import { User as DiscordUser } from "discord.js";

export class UserDaoManager extends AbstractDaoManager<DiscordUser, UserModel> {
    public async initInstance(): Promise<void> {
        await this.getOrCreate();
    }

    public static async getOrCreate(user: DiscordUser): Promise<UserModel> {
        const dataModel: [UserModel, boolean] = await User.findOrCreate({
            where: {
                userID: user.id
            },
            defaults: {
                userID: user.id
            }
        });

        return dataModel[0];
    }

    public static async get(user: DiscordUser): Promise<UserModel> {
        return User.findOne({
            where: {
                userID: user.id
            },
        });
    }

    public async getOrCreate(): Promise<UserModel> {
        return this.model = await UserDaoManager.getOrCreate(this.data);
    }
}
