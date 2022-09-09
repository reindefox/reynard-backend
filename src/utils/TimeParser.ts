export class TimeParser {
    private static readonly unitPattern: RegExp = /^(?<year>(\d+)(y|year|years|г|л|год|года|лет))?(?<mo>(\d+)(mo|mon|month|months|мес|месяц|месяца|месяцев))?(?<w>(\d+)(w|week|weeks|н|нед|неделя|недели|недель|неделю))?(?<d>(\d+)(d|day|days|д|день|дня|дней))?(?<h>(\d+)(h|hour|hours|ч|час|часа|часов))?(?<m>(\d+)(|m|min|mins|minute|minutes|м|мин|минута|минуту|минуты|минут))?(?<s>(\d+)(s|sec|secs|second|seconds|c|сек|секунда|секунду|секунды|секунд))?$/;

    public static readonly unit: { [unit: string]: number } = {
        second: 1,
        minute: 60,
        hour: 60 * 60,
        day: 60 * 60 * 24,
        week: 60 * 60 * 24 * 7,
        month: 60 * 60 * 24 * 30,
        year: 60 * 60 * 24 * 30 * 12,
    };

    public static getUnitArgsSum(argument: string): number {
        let sum: number = 0;

        try {
            const match: any[] = argument.match(this.unitPattern);

            if (!match) {
                return null;
            }

            /* Years */
            if (match[2]) {
                sum += match[2] * TimeParser.unit.year;
            }
            /* Months */
            if (match[5]) {
                sum += match[5] * TimeParser.unit.month;
            }
            /* Weeks */
            if (match[8]) {
                sum += match[8] * TimeParser.unit.week;
            }
            /* Days */
            if (match[11]) {
                sum += match[11] * TimeParser.unit.day;
            }
            /* Hours */
            if (match[14]) {
                sum += match[14] * TimeParser.unit.hour;
            }
            /* Minutes */
            if (match[17]) {
                sum += match[17] * TimeParser.unit.minute;
            }
            /* Seconds */
            if (match[20]) {
                sum += match[20] * TimeParser.unit.second;
            }
        } catch (e) {
            return null;
        }

        return sum;
    }
}
