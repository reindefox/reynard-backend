import { LocaleType } from "@src/assets/json/locale";
import { LocaleService } from "@src/services/guild/LocaleService";
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsLanguage(validationOptions?: ValidationOptions): PropertyDecorator {
    return function (object: Record<string, unknown>, propertyName: string) {
        registerDecorator({
            name: "IsLanguage",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments): boolean {
                    if (typeof value !== "string") {
                        return false;
                    }

                    return LocaleService.localesList.includes(<LocaleType><string>value);
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments?.property} language doesn't exist.`;
                }
            }
        });
    };
}
