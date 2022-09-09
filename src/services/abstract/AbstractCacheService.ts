export abstract class AbstractCacheService<T> {
    protected readonly data: T[] = [];

    public add(data: T): void {
        this.data.push(data);
    }

    public delete(data: T): boolean {
        const index: number = this.data.indexOf(data);

        if (index > -1) {
            this.data.splice(index, 1);

            return true;
        }

        return false;
    }

    public has(data: T): boolean {
        return this.get(data) !== null;
    }

    public get(data: T): T {
        for (const dataWrite of this.data) {
            if (Object.entries(dataWrite).every((entry: [string, unknown]) => data[entry[0]] === entry[1])) {
                return dataWrite;
            }
        }

        return null;
    }
}
