export class NumberFormatUtils {
    public static parseInt(expectedNumber: string): number {
        try {
            const num: number = Number.parseInt(expectedNumber);

            if (Number.isNaN(num)) {
                return null;
            }

            return num;
        } catch {
            return null;
        }
    }

    public static toChunk(chunkNumber: number, size: number): number[] {
        if (chunkNumber === 0 || size === 0) {
            return [chunkNumber];
        }

        if (chunkNumber === size) {
            return [chunkNumber];
        }

        let arr: number[] = new Array(Math.floor(chunkNumber / size)).fill(size);

        if (chunkNumber % size !== 0) {
            arr = arr.concat(chunkNumber % size);
        }

        return arr;
    }
}
