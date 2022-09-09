import { Reynard } from "@src/structures/Reynard";
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsCommand(validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsCommand",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    return Reynard.commands.has(value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments?.property} command doesn't exist.`;
                }
            }
        });
    };
}
