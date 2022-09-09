import { TimezoneType } from "@src/assets/json/timezone";
import { GuildModel } from "@src/database/models/Guild";
import { MomentService } from "@src/services/guild/MomentService";
import moment from "moment";

export class TimezoneService {
    public readonly moment: typeof moment;

    public static readonly defaultTimezone: string = "Europe/Moscow";

    constructor(private readonly guildData: GuildModel) {
        this.moment = new MomentService(this.guildData.locale).moment;
    }

    public timezoneExists(): boolean {
        return this.moment.tz.zone(this.guildData.timezone) !== null;
    }

    public setGuildTimezone(timezone: TimezoneType = TimezoneService.defaultTimezone): void {
        this.guildData.timezone = timezone;
        void this.guildData.save();
    }

    public get getTimezone(): TimezoneType {
        return this.guildData.timezone;
    }
}
