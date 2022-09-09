import get from "lodash/get";

export class StringArgumentsParser {
    public static parseObjectArguments(language: object, properties: string, args?: any[]): string {
        let propertyString: string = get(language, properties);

        if (!propertyString) {
            console.log(`Error at parsing: ${properties} | ${args}`);
            return null;
        }

        if (args && args.length > 0) {
            const stringMatcher: string[] = propertyString.match(/({%).+?(%})/g);

            if (!stringMatcher) {
                return propertyString;
            }

            if (stringMatcher.length !== args.length)
                throw new Error(`Not enough arguments at parsing: ${properties} | ${args} | ${stringMatcher}`);

            for (let i = 0; i < stringMatcher.length; i++) {
                propertyString = propertyString.replace(stringMatcher[i], args[i].toString());
            }
        }

        return propertyString;
    }
}
