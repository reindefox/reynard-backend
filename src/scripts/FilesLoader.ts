import { Locale, LocaleLanguage } from "@src/assets/lang/interfaces/Locale";
import { CommandConstructor } from "@src/common/abstractions/command/interfaces/Command";
import { AbstractEventConstructor } from "@src/common/abstractions/event/interfaces/Event";
import { ModulesLoader } from "@src/modules/ModulesLoader";
import { createErrorLog } from "@src/scripts/Logger";
import { ClientTaskManager } from "@src/services/ClientTaskManager";
import { LocaleService } from "@src/services/guild/LocaleService";
import { Reynard } from "@src/structures/Reynard";
import { ObjectUtils } from "@src/utils/ObjectUtils";
import { Collection } from "discord.js";
import fs from "fs";
import { readdir } from "fs/promises";
import get from "lodash/get";

export class FilesLoader {
    public static async defaultInitialization(): Promise<void> {
        await this.loadTasks()
            .catch(e => createErrorLog(e, __filename));
    }

    public static async loadCommands(): Promise<Collection<string, CommandConstructor>> {
        const commands: Collection<string, CommandConstructor> = new Collection<string, CommandConstructor>();

        const commandFiles = await this.getFiles("src/global/commands/")
            .catch(e => createErrorLog(e, __filename, true, "Failed to load commands."));

        for (let i in commandFiles) {
            if (commandFiles.hasOwnProperty(i)) {
                const command: CommandConstructor = (await import(`../global/commands/${commandFiles[i].folder}/${(<string>commandFiles[i].name)
                    .split(".")[0]}`)).default;

                commands.set(command.options.name, command);
            }
        }

        console.log(`- Loaded ${commandFiles.length} commands`);

        return commands;
    }

    public static async loadEvents(): Promise<Map<string, AbstractEventConstructor>> {
        const events: Map<string, AbstractEventConstructor> = new Map<string, AbstractEventConstructor>();

        const eventFiles = await this.getFiles("src/global/events/")
            .catch(e => createErrorLog(e, __filename, true, "Failed to load events."));

        for (let i in eventFiles) {
            if (eventFiles.hasOwnProperty(i)) {
                const eventName: string = (<string>eventFiles[i].name).split(".")[0];
                const event: any = (await import(`../global/events/${eventFiles[i].folder}/${eventName}`)).default;

                events.set(eventName, event);

                Reynard.client.on(event.options.keyName, (...args: unknown[]) => {
                    new event(event.options)
                        .run(...args)
                        .catch(e => createErrorLog(e, __filename));
                });
            }
        }

        console.log(`- Loaded ${eventFiles.length} event files`);

        await new ModulesLoader().loadModules()
            .catch(e => createErrorLog(e, __filename));

        return events;
    }

    private static async loadLocale(locales: Map<string, object>, languageName: string): Promise<void> {
        const localeFile: any = (await import(`../assets/lang/${languageName}/${languageName}`)
            .catch(e => createErrorLog(e, __filename, true, `Failed to load ${languageName} locale file.`)))?.default;

        if (!localeFile) {
            console.log(`Failed to load ${languageName} locale`);
            return;
        }

        locales.set(languageName, localeFile);
    }

    private static async loadCommandLocale(locales: Map<string, object>, commandLocale: string): Promise<void> {
        const localeFile: any = (await import(`../assets/lang/${commandLocale}/commands`)
            .catch(e => createErrorLog(e, __filename, true, `Failed to load ${commandLocale} command locale file.`)))?.default;

        if (!localeFile) {
            console.log(`Failed to load ${commandLocale} command locale`);
            return;
        }

        locales.set(commandLocale, localeFile);
    }

    private static async loadCommonLocaleCommands(locales: Map<string, object>): Promise<void> {
        const localeFile: any = (await import(`../assets/lang/common/commands`)
            .catch(e => createErrorLog(e, __filename, true, `Failed to load common commands locale file.`))).default;

        if (!localeFile) {
            console.log(`Failed to load common locale`);
            return;
        }

        const localeKeys: string[] = Array.from(locales.keys());
        const commonCommands: string[] = Object.keys(localeFile);

        for (const locale of localeKeys) {
            const localeRecord: Record<any, any> = locales.get(locale);

            for (let commonCommand in commonCommands) {
                if (localeRecord.hasOwnProperty(commonCommands[commonCommand])) {
                    localeRecord[commonCommands[commonCommand]].keys = localeRecord[commonCommands[commonCommand]].keys.concat(localeFile[commonCommands[commonCommand]].keys);
                }
            }
        }
    }

    public static async loadLocales(): Promise<Locale> {
        const common: LocaleLanguage = new Map();
        const locales: LocaleLanguage = new Map();
        const commands: LocaleLanguage = new Map();

        for (const locale of LocaleService.localesList) {
            await this.loadLocale(locales, locale);
            await this.loadCommandLocale(commands, locale);
        }

        const keysArray: string[] = Array.from(locales.keys());
        const valuesArray: Record<any, any>[] = Array.from(locales.values());

        const difference: string[] = [];

        for (let i = 0; i < valuesArray.length; i++) {
            if (valuesArray[i + 1]) {
                const firstObjectKeys = Object.keys(ObjectUtils.flattenObject(valuesArray[i]));
                const secondObjectKeys = Object.keys(ObjectUtils.flattenObject(valuesArray[i + 1]));

                for (let j in firstObjectKeys) {
                    if (!secondObjectKeys.includes(firstObjectKeys[j])) {
                        difference.push(`${keysArray[i + 1]} > ${firstObjectKeys[j]}: "${get(valuesArray[i], firstObjectKeys[j])}"`);
                    }
                }

                for (let j in secondObjectKeys) {
                    if (!firstObjectKeys.includes(secondObjectKeys[j]) && !difference.includes(`${keysArray[i]} > ${secondObjectKeys[j]}`)) {
                        difference.push(`${keysArray[i]} > ${secondObjectKeys[j]}: "${get(valuesArray[i + 1], secondObjectKeys[j])}"`);
                    }
                }
            }
        }

        if (difference.length > 0) {
            fs.writeFileSync("data/localesDifference.txt", difference.join("\n"));
            console.log("* Locale files are not equal. Difference has been written to file.");
        }

        await this.loadCommonLocaleCommands(commands);

        return <Locale>{
            common: common,
            specific: locales,
            command: commands
        };
    }

    public static async loadTasks(): Promise<void> {
        await ClientTaskManager.loadOnInitialization();
    }

    public static async getFiles(path: string = "./"): Promise<any[]> {
        const entries: any[] = await readdir(path, {withFileTypes: true});

        const files: any[] = entries
            .filter(file => !file.isDirectory())
            .map(file => ({name: file.name, path: path + file.name, folder: path.split("/").slice(-2)[0]}));

        const folders: any[] = entries.filter(folder => folder.isDirectory());

        for (const folder of folders) {
            files.push(...await this.getFiles(`${path}${folder.name}/`));
        }

        return files;
    }
}
