export class ArrayUtils {
    public static toChunkArray<T = any>(array: T[], chunkSize: number): T[][] {
        const chunkArray: T[][] = [];

        for (let i = 0; i < Math.ceil(array.length / chunkSize); i++) {
            chunkArray[i] = array.slice(i * chunkSize, i * chunkSize + chunkSize);
        }

        return chunkArray;
    }
}
