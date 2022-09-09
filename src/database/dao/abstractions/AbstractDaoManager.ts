import { BaseDataModel } from "@src/database/models/base/BaseDataModel";

export abstract class AbstractDaoManager<T, K extends BaseDataModel> {
    public readonly data: T;
    public model: K;

    constructor(data: T) {
        this.data = data;
    }

    public abstract initInstance(): Promise<void>;

    public abstract getOrCreate(): Promise<K>;
}
