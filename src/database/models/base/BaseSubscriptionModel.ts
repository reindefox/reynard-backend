import { BaseDataModel } from "@src/database/models/base/BaseDataModel";

export interface BaseSubscriptionModel extends BaseDataModel {
    toggle: boolean;
    webhookID: string;
    webhookToken: string;
}
