export const timezones: Timezone[] = [
    {
        key: "Pacific/Auckland",
        name: "International Date Line West (IDLW)",
        utc: "-12"
    },
    {
        key: "Pacific/Midway",
        name: "Nome Time (NT)",
        utc: "-11"
    },
    {
        key: "Pacific/Honolulu",
        name: "Hawaii Standard Time (HST)",
        utc: "-10"
    },
    {
        key: "America/Nome",
        name: "Alaska Standard Time (AKST)",
        utc: "-9"
    },
    {
        key: "America/Los_Angeles",
        name: "Pacific Standard Time (PST)",
        utc: "-8"
    },
    {
        key: "America/Denver",
        name: "Mountain Standard Time (MST)",
        utc: "-7"
    },
    {
        key: "America/Chicago",
        name: "Central Standard Time (CST)",
        utc: "-6"
    },
    {
        key: "America/New_York",
        name: "Eastern Standard Time (EST)",
        utc: "-5"
    },
    {
        key: "Atlantic/Bermuda",
        name: "Atlantic Standard Time (AST)",
        utc: "-4"
    },
    {
        key: "America/Argentina/Buenos_Aires",
        name: "Argentina Time (ART)",
        utc: "-3"
    },
    {
        key: "Atlantic/South_Georgia",
        name: "Azores Time (AT)",
        utc: "-2"
    },
    {
        key: "Atlantic/Cape_Verde",
        name: "West Africa Time (WAT)",
        utc: "-1"
    },
    {
        key: "Europe/London",
        name: "Greenwich Mean Time (GMT)",
        utc: "0"
    },
    {
        key: "Europe/Berlin",
        name: "Central European Time (CET)",
        utc: "+1"
    },
    {
        key: "Europe/Kiev",
        name: "Eastern European Time (EET)",
        utc: "+2"
    },
    {
        key: "Europe/Moscow",
        name: "Moscow Time (MSK)",
        utc: "+3"
    },
    {
        key: "Asia/Yerevan",
        name: "Armenia Time (AMT)",
        utc: "+4"
    },
    {
        key: "Asia/Karachi",
        name: "Pakistan Standard Time (PKT)",
        utc: "+5"
    },
    {
        key: "Asia/Omsk",
        name: "Omsk Time (OMSK)",
        utc: "+6"
    },
    {
        key: "Asia/Krasnoyarsk",
        name: "Kranoyask Time (KRAT)",
        utc: "+7"
    },
    {
        key: "Asia/Shanghai",
        name: "China Standard Time (CST)",
        utc: "+8"
    },
    {
        key: "Asia/Tokyo",
        name: "Japan Standard Time (JST)",
        utc: "+9"
    },
    {
        key: "Asia/Vladivostok",
        name: "Eastern Australia Standard Time (AEST)",
        utc: "+10"
    },
    {
        key: "Asia/Srednekolymsk",
        name: "Sakhalin Time (SAKT)",
        utc: "+11"
    },
    {
        key: "Petropavlovsk-Kamchatsky",
        name: "New Zealand Standard Time (NZST)",
        utc: "+12"
    }
];

export const timezoneKeys: TimezoneType[] = timezones.map(e => e.key);

export interface Timezone {
    key: string;
    name: string;
    utc: string;
}

export type TimezoneType = typeof timezones[number]["key"]
