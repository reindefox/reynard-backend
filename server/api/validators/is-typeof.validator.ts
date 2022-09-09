import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsTypeof<T>(types: T[], validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsTypeof",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    return types.includes(value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments.property} must be a timezone format.`;
                }
            }
        })
    };
}
