import { GuildDaoManager } from "@src/database/dao/managers/GuildDaoManager";
import { GuildLocaleService } from "@src/services/guild/GuildLocaleService";
import { LineStringBuilder } from "@src/utils/LineStringBuilder";

export class LogLineStringBuilder extends LineStringBuilder {
    private readonly localeService: GuildLocaleService;

    constructor(protected readonly guildDaoManager: GuildDaoManager) {
        super();
        this.localeService = guildDaoManager.localeService;
    }

    public addFieldLine(property: string, value: any, code: boolean = true, showNone: boolean = false): this {
        if (property && value) {
            switch (code) {
                default:
                case true: {
                    this.newLineAppend(`${property}: \`${value.toString()}\``);
                    break;
                }
                case false: {
                    this.newLineAppend(`${property}: ${value.toString()}`);
                    break;
                }
            }
        } else if (showNone) {
            this.newLineAppend(`${property}: \`${this.getNone()}\``);
        }

        return this;
    }

    public addFieldLineProperty(lineType: LineType, value: any, code: boolean = true, showNone: boolean = false): this {
        let keyword: string = null;

        switch (lineType) {
            case LineType.NEW: {
                keyword = this.getNew();
                break;
            }
            case LineType.OLD: {
                keyword = this.getOld();
                break;
            }
            default:
                break;
        }

        this.addFieldLine(keyword, value, code, showNone);

        return this;
    }

    public getNone(): string {
        return this.localeService.languageRecord.eventLogger.keyword.none;
    }

    public getEnabled(): string {
        return this.localeService.languageRecord.eventLogger.keyword.enabled;
    }

    public getDisabled(): string {
        return this.localeService.languageRecord.eventLogger.keyword.disabled;
    }

    public getNew(): string {
        return this.localeService.languageRecord.eventLogger.keyword.new;
    }

    public getOld(): string {
        return this.localeService.languageRecord.eventLogger.keyword.old;
    }

    public addNewDataLine(): this {
        this.newLineAppend(`${this.getNew()}:`);

        return this;
    }

    public addOldDataLine(): this {
        this.newLineAppend(`${this.getOld()}:`);

        return this;
    }
}

export enum LineType {
    OLD,
    NEW,
}
