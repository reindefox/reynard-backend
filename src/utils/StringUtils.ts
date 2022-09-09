export class StringUtils {
    public static checkStringifiedArrayLength(array: any[], maxLength: number): boolean {
        if (!array || !maxLength) {
            return false;
        }

        return maxLength > array.toString().length;
    }

    public static getDomainName(url: string): string {
        const match: string[] = new RegExp(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/gmi).exec(url);

        if (match && match[1]) {
            return match[1];
        }

        return null;
    }

    public static getFileExtension(url: string): string {
        const match: string[] = new RegExp(/\.([0-9a-z]+)(?=[?#])|(\.)[\w]+$/gmi).exec(url);

        if (match) {
            return match[1] || match[0]?.replace(/[.]/g, "");
        }

        return null;
    }
}
