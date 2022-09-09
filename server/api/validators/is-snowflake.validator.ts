import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsSnowflake(validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsSnowflake",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    return IsSnowflakeStatic(value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments?.property} must be a snowflake string.`;
                }
            }
        });
    };
}

export function IsSnowflakeStatic(value: any): boolean {
    /* Enable null value if we need to remove value from DB */
    if (value === null) {
        return true;
    }

    if (typeof value === "string") {
        if (value.length >= 17 && value.length <= 19 && value.match(/^\d+$/)) {
            return true;
        }
    }

    return false;
}
