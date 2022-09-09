import { LocaleType } from "@src/assets/json/locale";
import { StringArgumentsParser } from "@src/utils/StringArgumentsParser";
import get from "lodash/get";

export abstract class AbstractLocaleService {
    protected _currentLocale: LocaleType;
    protected _currentCommandsLocale: LocaleType;

    protected _languageRecord: Record<any, any>;
    protected _commandsLanguageRecord: Record<any, any>;

    public get languageRecord(): Record<any, any> {
        return this._languageRecord;
    }

    public translate(properties: string, args?: any[]): string {
        return StringArgumentsParser.parseObjectArguments(this._languageRecord, properties, args);
    }

    public propertyExists(property: string): boolean {
        return !!get(this._languageRecord, property);
    }

    public get commandsLanguageRecord(): Record<any, any> {
        return this._commandsLanguageRecord;
    }

    public get currentLocale(): LocaleType {
        return this._currentLocale;
    }
}
