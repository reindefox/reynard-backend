import { BaseDataModel, getSetParse } from "@src/database/models/base/BaseDataModel";
import { PostgreSQL } from "@src/scripts/PostgreSQLHandler";
import { DataTypes } from "sequelize";
import { ModelCtor } from "sequelize/types/lib/model";

export const User: ModelCtor<UserModel> = PostgreSQL.instance.sequelize.define<UserModel>("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id"
    },
    userID: {
        type: DataTypes.STRING,
        field: "user_id"
    }
}, {
    tableName: "users"
});

export interface UserModel extends BaseDataModel {
    id: number;
    userID: string;
}
