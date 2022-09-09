import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsNotBlank(validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsNotBlank",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    if (typeof value === "string") {
                        return value.trim().length > 0;
                    }

                    return false;
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments?.property} must not be empty.`;
                }
            }
        });
    };
}
