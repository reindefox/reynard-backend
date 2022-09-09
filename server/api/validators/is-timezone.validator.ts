import { timezoneKeys } from "@src/assets/json/timezone";
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsTimezone(validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsTimezone",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    if (typeof value !== "string") {
                        return false;
                    }

                    return timezoneKeys.includes(value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments.property} must be a timezone format.`;
                }
            }
        })
    };
}
