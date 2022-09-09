import { createErrorLog } from "@src/scripts/Logger";
import { Model } from "sequelize";

export interface BaseDataModel extends Model {

}

export function getSetParse(key: string, requiredType: ArrayConstructor | ObjectConstructor = Object): { get: () => any, set: (value: any) => any } {
    return {
        get: function (): any {
            let expectedObject: Record<any, any> | any[];

            try {
                expectedObject = JSON.parse(this.getDataValue(key));
            } catch (e) {
                expectedObject = new requiredType();
                createErrorLog(e, __filename, false, `An error occurred while parsing ${key} (${requiredType})`);
            }

            return expectedObject;
        },
        set: function (value: any): any {
            this.setDataValue(key, JSON.stringify(value));
        }
    };
}
