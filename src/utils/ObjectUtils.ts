export class ObjectUtils {
    public static flattenObject(target: object): object {
        const returnObject: object = {};

        for (let i in target) {
            if (target.hasOwnProperty(i)) {
                if (typeof target[i] === "object" && target[i] !== null) {
                    const flattenObject: object = this.flattenObject(target[i]);
                    for (let j in flattenObject) {
                        if (flattenObject.hasOwnProperty(j)) {
                            returnObject[i + "." + j] = flattenObject[j];
                        }
                    }
                } else {
                    returnObject[i] = target[i];
                }
            }
        }

        return returnObject;
    }
}
