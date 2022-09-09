import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsColor(validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsColor",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    if (typeof value !== "string") {
                        return false;
                    }

                    return new RegExp(/^#[0-9A-F]{6}$/i).test(value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments?.property} must be a HEX-string.`;
                }
            }
        });
    };
}
