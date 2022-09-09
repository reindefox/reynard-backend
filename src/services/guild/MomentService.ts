import { LocaleType } from "@src/assets/json/locale";
import { LocaleService } from "@src/services/guild/LocaleService";
import moment from "moment";

export class MomentService {
    public static readonly defaultFormat: string = "DD-MM-YYYY kk:mm:ss ddd";

    private readonly _moment: typeof moment = moment;

    constructor(locale: LocaleType) {
        this._moment.locale(locale) || this._moment.locale(LocaleService.defaultLocale);
    }

    public get moment(): typeof moment {
        return this._moment;
    }

    public getUTCFormat(timestamp: number, format: string): string {
        return `${this._moment(timestamp, format).format(MomentService.defaultFormat)} [UTC]`;
    }

    public static getUTCFormat(timestamp: number, format: string): string {
        return `${moment(timestamp, format).format(this.defaultFormat)} [UTC]`;
    }
}
