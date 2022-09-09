import { inlineCode } from "@discordjs/builders";
import { emoji } from "@src/assets/json/emoji";
import { properties } from "@src/assets/json/properties";
import TriggeredCommand from "@src/global/commands/fun/TriggeredCommand";
import ClearCommand from "@src/global/commands/moderation/ClearCommand";
import prettyBytes from "pretty-bytes";

const ru_RU = {
    global: {
        min: "мин",
        kbps: "кбит/c",
        none: "Нет",
        true: "Да",
        false: "Нет",
        clientError: `Произошла внутренняя ошибка. Пожалуйста, свяжитесь с разработчиком на сервере поддержки: [\`*тык сюда*\`](${properties.communityServer.url})`,
        undefined: "Неизвестно",
        null: "Неизвестно",
        0: "Нет",
        1: "Да"
    },
    command: {
        keyword: {
            name: "Команда",
            category: "Категория",
            description: "Описание",
            usage: "Использование",
            aliases: "Псевдонимы",
            requiredPermissions: "Необходимые права",
            none: "Нет"
        },
        response: {
            done: "**Выполнено**",
            error: "**Ошибка**",
            missArgs: "**Недостаточно параметров**\n" +
                "**<...>** — Обязательный параметр\n" +
                "**[...]** — Опциональный параметр\n" +
                "**A | B | C** — Любой из параметров",
            missPerms: "**Недостаточно прав**",
            waitAns: "**Ожидание ответа**"
        },
        category: {
            information: "Информация",
            settings: "Настройки",
            utilities: "Утилиты",
            moderation: "Модерация",
            fun: "Развлечения"
        },
        run: {
            serverOnly: "Эта команда доступна только на сервере",
            dmOnly: "Эта команда доступна только в личных сообщениях бота",
            lowExecutorPermissions: "Вы не можете выгнать следующих участников, т.к. ваша наивысшая роль ниже, чем у кого-либо из них:",
            lowClientPermissions: "Роль бота ниже, чем наивысшая роль одного из следующих участников:",
            selfAction: "Вы не можете использовать эту команду на себе",
            clientAction: "Вы не можете использовать эту команду на боте",
            botAction: "Вы не можете использовать эту команду на ботах",
            ownerAction: "Вы не можете использовать эту команду на владельце сервера",
            maxMentions: "{%size%} — максимальное количество упоминанй на одну команду",
        },
        requiredParameters: "<...> — Обязательный параметр\n[...] — Опциональный параметр\nA | B | C — Любой из параметров",
        getDetailedInfo: `${emoji.yellowPoint.string} Веб-сайт: {%url%}`,
        example: "Пример",
        duration: "Длительность",
        moderator: "Модератор",
        reason: "Причина",
        until: "До",
        minDuration: "Минимальная длительность — \`{%sec%}\` секунд.",
        clientPermissions: "Для вызова данной команды боту необходимы следующие права:",
        user: {
            common: "Общее",
            about: "{%user%}",
            registered: "Зарегистрирован",
            status: "Статус",
            customStatus: "Кастомный статус",
            statusType: "Тип",
            playing: "Играет",
            username: "Имя пользователя",
            joinedAt: "Вступил",
            usage: "[@Участник | ID]",
            description: "Показывает информацию об участнике: имя, статус, дату вступления и регистрации, аватар и т.д.",
            examples: [
                {
                    usage: "",
                    description: "Показывает информацию об участнике, который вызвал команду."
                },
                {
                    usage: "@Участник",
                    description: "Показывает информацию об упомянутом участнике."
                },
                {
                    usage: "345980126820958210",
                    description: "Показывает информацию об участнике с указанным ID."
                }
            ]
        },
        kick: {
            successResponse: "Следующие участники были кикнуты:",
            nobody: "Никто не был выгнан. Возможно, вы делаете что-то не так.",
            usage: "<@Участник | ID, [@Участник | ID, [...]]> [причина]",
            description: "Выгоняет указанных участников с сервера.",
            examples: [
                {
                    usage: "@Участник",
                    description: "Выгнать упомянутого участника."
                },
                {
                    usage: "@Участник ненормативная лексика",
                    description: "Выгнать упомянутого участника с указанием причины."
                }
            ]
        },
        help: {
            usage: "[категория]",
            description: "Показывает информацию о всех доступных командах с категориями.",
            examples: [
                {
                    usage: "",
                    description: "Показать список всех доступных команд для вызвавшего команду."
                },
                {
                    usage: "модерация",
                    description: "Показать все доступные команды из указанной категории."
                }
            ]
        },
        ban: {
            banReason: "За нарушение",
            usage: "<@Участник | ID, [@Участник | ID, [...]]> [длительность] [дни, за которые удалить сообщения (0-7)] [причина]",
            description: "Выдает бан на сервере указанным участникам",
            successResponse: "Следующие участники были забанены:",
            nobody: "Никто не был забанен. Возможно, вы делаете что-то не так.",
            examples: [
                {
                    usage: "@Участник",
                    description: "Выдает перманентную блокировку указанному участнику."
                },
                {
                    usage: "@Участник неподобающее поведение",
                    description: "Выдает перманентую блокироку с причиной указанному участнику."
                },
                {
                    usage: "@Участник 1мес 3 прекратите спорить",
                    description: "Выдает блокировку с указанием причины, которая будет снята через 1 месяц, а так же удаляет все сообщения " +
                        "участника за последние 3 дня."
                }
            ]
        },
        unban: {
            memberNotFound: "Участник не был найден в списке забаненных.",
            unbanned: "{%user%} был разбанен.",
            description: "Снимает блокировку с указанного пользователя.",
            usage: "<@Участник | ID | Тэг | Имя пользователя> [причина]",
            examples: [
                {
                    usage: "45980126820958210 амнистия",
                    description: "Снимает блокировку с участника с указанием причины."
                }
            ]
        },
        warn: {
            successResponse: "Следующим участникам было выдано предупреждение:",
            nobody: "Предупреждение никому не было выдано. Возможно, вы делаете что-то не так.",
            additionalPunishment: "Следующие участники были наказаны за многочисленные предупреждения:",
            usage: "<@Участник | ID, [@Участник | ID, [...]]> [длительность] [причина]",
            hasBeenKicked: "был выгнан",
            hasBeenBanned: "был забанен",
            kickReason: "За нарушения",
            description: "Выдает предупреждение указанным участникам.",
            examples: [
                {
                    usage: "@Участник",
                    description: "Выдает перманентное предупреждение указанному участнику."
                },
                {
                    usage: "@Участник ненормативная лексика",
                    description: "Выдает перманентное предупреждение указанному участнику с указанием причины."
                },
                {
                    usage: "@Участник 7д12ч ненормативная лексика",
                    description: "Выдает предупреждение указанному участнику с указанием причины, которое истечёт через 7 дней и 12 часов."
                }
            ]
        },
        warns: {
            total: "Предупреждения {%username%} [{%count%}]",
            page: "Страница",
            notFound: "Не было найдено ни одного предупреждения.",
            description: "Показывает все предупреждения указанного участника.",
            usage: "[@Участник | ID]"
        },
        remwarn: {
            usage: "<номер случая>",
            description: "Удаляет предупреждения с указанным номером.",
            examples: [
                {
                    usage: "25",
                    description: "Удаляет предупреждение с номером 25."
                }
            ],
            notFound: "Предупреждение с номером **`#{%caseID%}`** не найдено",
            success: "Предупреждение с номером **`#{%caseID%}`** удалено"
        },
        avatar: {
            header: "Аватар {%user%}",
            description: "Выдает аватар указанного пользователя.",
            usage: "<@Участник | ID>",
        },
        stats: {
            description: "Показывает детальную статистику бота.",
            statistics: "Статистика {%bot_username%}",
            valuesUpdateCoolDown: `Некоторые значения обновляются своевременно, независимо от вызова команды[.](${properties.secretUrl})`,
            common: "Общее",
            servers: "Серверов",
            users: "Пользователей",
            client: "Клиент",
            information: "Информация",
            ping: "Пинг",
            writtenIn: "Написан на",
            devPage: "Профиль разработчика",
            version: "Версия",
            started: "Запущен",
            pingValue: "{%ping%} мс",
        },
        clear: {
            cleared: "Удалено **`{%cleared%}`** сообщение(-ий).",
            skipped: `${emoji.yellowPoint.str} Сообщения, которым больше 2 недель, были пропущены из-за ограничений дискорда.`,
            pinned: `${emoji.yellowPoint.str} Закреплённые сообщения были пропущены.`,
            notFound: "Не найдено ни одного сообщения для очистки.",
            usage: "<количество> [@Участник | ID | боты | участники]",
            description: "Очищает определённое количество сообщений (исключая закреплённые).\n" +
                `Максимум сообщений за вызов команды — \`${ClearCommand.maxDeleteCount}\`.`,
            examples: [
                {
                    usage: "25",
                    description: "Удалить последние 25 сообщений."
                },
                {
                    usage: "50 @Участник",
                    description: "Удалить сообщения только указанного участника из последних 50 штук."
                },
                {
                    usage: "100 боты",
                    description: "Удалить сообщения только ботов из последних 100 штук."
                }
            ]
        },
        slowmode: {
            setToNumber: "Задержка между отправкой сообщения для участника теперь **\`{%time%}\`**.",
            disabled: "Задержка между отправкой сообщений была отключена для этого канала.",
            description: `Устанавливает задержку между между отправкой сообщений для каждого участника в текущем канале.\n` +
                `Максимальное количество — 6 часов.\n` +
                "Введите \`0\` для отключения.",
            usage: "<секунды>",
            examples: [
                {
                    usage: "60с",
                    description: "Устанавливает задержку в 60 секунд между отправкой сообщений для пользователей."
                },
                {
                    usage: "0",
                    description: "Отключает задержку между отправкой сообщений."
                }
            ]
        },
        emoji: {
            notAnEmoji: "Это не похоже на эмодзи.",
            description: "Показывает информацию и картинку указанного эмодзи.",
            usage: "<эмодзи | ID>"
        },
        petpet: {
            description: "Создает gif-анимацию 'petpet' с аватаром указанного пользователя.",
            usage: "[@Участник | ID]",
            sad: "Так грустно, когда тебя больше никто не гладит :("
        },
        triggered: {
            description: "Создает gif-анимацию 'triggered' с прикреплённой картинкой / картинкой с ссылки.\n\n" +
                `Разрешенные домены: ${TriggeredCommand.allowedImageDomains.map(e => inlineCode(e)).join(", ")}\n` +
                `Разрешенные форматы: ${TriggeredCommand.allowedImageExtensions.map(e => inlineCode(e)).join(", ")}\n` +
                `Макс. вес: \`${prettyBytes(TriggeredCommand.maxImageFileByteLength)}\`\n` +
                `Макс. ширина: \`${TriggeredCommand.maxImageSize.width} px\` | Макс. высота: \`${TriggeredCommand.maxImageSize.height} px\``,
            usage: "<Ссылка | Вложение>",
        },
        mute: {
            successResponse: "Следующим участника был выдан мьют:",
            nobody: "Никто не был замьючен. Возможно, вы делаете что-то не так.",
            calledCommand: "Вызвана команда.",
            description: "Выдает мьют указанным участникам.",
            usage: "<@Участник | ID, [@Участник | ID, [...]]> [длительность] [причина]",
            examples: [
                {
                    usage: "@Участник",
                    description: "Выдает перманентный мьют указанному участнику."
                },
                {
                    usage: "@Участник 7д",
                    description: "Выдает мьют указанному участнику, который истечёт через 7 дней."
                },
                {
                    usage: "@Участник 12ч агрессивное поведение",
                    description: "Выдает мьют указанному частнику с указанием причины, который истечёт через 12 часов."
                }
            ],
            muteRoleNotFound: "Роль для мьюта не найдена. Пожалуйста, укажите её, или включите галочку \"Автоматически конфигурируемая роль мьюта\".",
            muteReason: "За нарушения"
        },
        unmute: {
            unmuted: "С участника {%user%} был снят мьют.",
            notMuted: "У участника {%user%} нет мьюта.",
            description: "Снимает мьют с указанного участника.",
            usage: "<@Участник | ID> [причина]",
            examples: [
                {
                    usage: "345980126820958210 амнистия",
                    description: "Снимает мьют с участника с указанием причины."
                }
            ]
        },
        support: {
            description: "Отправляет ссылку-приглашение на сервер поддержки.",
        },
        emptychat: {
            description: "Отправляет большое пустое сообщение, которое визуально очищает чат.",
        },
        fox: {
            description: "Отправляет рандомную картинку лисички.",
        },
        server: {
            description: "Показывает детальную информацию о сервере",
            name: "Название",
            owner: "Владелец",
            modLvl: "Уровень модерации",
            created: "Создан",
            undefined: "Отсутствует"
        },
        math: {
            description: "Вычисляет значение выражения",
            error: "Произошла ошибка во время вычисления выражения \`{%expr%}\`:"
        }
    },
    event: {
        channelCreate: {
            description: "Логирование при создании канала / категории"
        },
        channelDelete: {
            description: "Логирование при удалении канала / категории"
        },
        channelPinsUpdate: {
            description: "Логирование при закреплении / откреплении сообщения в канале"
        },
        channelUpdate: {
            description: "Логирование при обновлении канала. Например, название, описание"
        },
        emojiCreate: {
            description: "Логирование при добавлении эмодзи на сервер"
        },
        emojiDelete: {
            description: "Логирование при удалении эмодзи с сервера"
        },
        emojiUpdate: {
            description: "Логирование при обновлении эмодзи. Например, изменение имени"
        },
        guildBanAdd: {
            description: "Логирование при бане участника на сервере"
        },
        guildBanRemove: {
            description: "Логирование при разбане участника на сервере"
        },
        guildIntegrationsUpdate: {
            description: "Логирование при обновлении интеграций сервера"
        },
        guildMemberAdd: {
            description: "Логирование при заходе участника на сервер"
        },
        guildMemberRemove: {
            description: "Логирование при выходе участника с сервера"
        },
        guildMemberUpdate: {
            description: "Логирование при изменении участника. Например, изменение имени, ролей"
        },
        guildUpdate: {
            description: "Логирование при изменении настроек сервера"
        },
        inviteCreate: {
            description: "Логирование при создании ссылки-приглашения на сервер"
        },
        inviteDelete: {
            description: "Логирование при удалении ссылки-приглашения на сервер"
        },
        messageDelete: {
            description: "Логирование при удалении сообщения"
        },
        messageDeleteBulk: {
            description: "Логирование при массовом удалении сообщений"
        },
        messageReactionRemoveAll: {
            description: "Логирование при удалении всех реакций с сообщения"
        },
        messageUpdate: {
            description: "Логирование при измениии сообщения"
        },
        roleCreate: {
            description: "Логирование при создании роли"
        },
        roleDelete: {
            description: "Логирование при удалении роли"
        },
        roleUpdate: {
            description: "Логирование при изменении роли. Например, цвет, название"
        },
        voiceStateUpdate: {
            description: "Логирование при изменении состояния голосового канала. Например, участник подключился / отключился, был замьючен"
        },
        webhookUpdate: {
            description: "Логирование при создании / удалении / изменении вебхука канала"
        },
        stickerCreate: {
            description: "Логирование при добавлении стикера на сервер"
        },
        stickerDelete: {
            description: "Логирование при удалении стикера с сервера"
        },
        stickerUpdate: {
            description: "Логирование при изменении стикера на сервере. Например, название, эмодзи или описание"
        },
        threadCreate: {
            description: "Логирование при создании ветки (треда)"
        },
        threadDelete: {
            description: "Логирование при удалении ветки (треда)"
        },
        threadUpdate: {
            description: "Логирование при изменении ветки (треда). Например, название, архивация или блокировка"
        }
    },
    eventLogger: {
        keyword: {
            channel: "Канал",
            name: "Название",
            type: "Тип",
            position: "Позиция",
            emoji: "Эмодзи",
            animated: "Анимированное",
            tag: "Тэг",
            user: "Пользователь",
            reason: "Причина",
            member: "Участник",
            nickname: "Никнейм",
            registered: "Зарегистрирован",
            role: "Роль",
            roles: "Роли",
            accountAge: "Возраст аккаунта",
            old: "Было",
            new: "Стало",
            nameUpdate: "Изменение имени",
            added: "Добавлено",
            removed: "Удалено",
            all: "Все",
            none: "Нет",
            permissions: "Права",
            allow: "Разрешено",
            deny: "Запрещено",
            viewConnect: "Видеть / подключаться",
            viewRead: "Видеть / читать",
            invite: "Приглашение",
            never: "Никогда",
            link: "Ссылка",
            author: "Автор",
            createdAt: "Создано",
            message: "Сообщение",
            color: "Цвет",
            hoist: "Показывать отдельно",
            managed: "Управляемая",
            mentionable: "Упоминаемая",
            voiceChannel: "Голосовой канал",
            webhook: "Вебхук",
            executor: "Исполнитель",
            clickMessage: "💬 Нажмите"
        },
        channelCreate: {
            name: "Создание канала",
            description: "Был создан канал / категория"
        },
        channelDelete: {
            name: "Удаление канала",
            description: "Был удалён канал / категория"
        },
        channelPinsUpdate: {
            name: "Обновление закреплённых сообщений",
            description: "Были обновлены закреплённые сообщения в канале"
        },
        channelUpdate: {
            name: "Обновление настроек канала",
            description: "Настройки канала были изменены",
            topic: "Изменение описания",
            nsfw: "NSFW режим",
            coolDown: "Задержка между сообщениями",
            bitrate: "Изменение битрейта",
            userLimit: "Лимит пользователей",
            permissions: "Изменение прав",
            permissionsDesc: "Права были обновлены",
            enabled: "Включено",
            disabled: "Выключено"
        },
        emojiCreate: {
            name: "Добавлие эмодзи",
            description: "Эмодзи было добавлено на сервер"
        },
        emojiDelete: {
            name: "Удаление эмодзи",
            description: "Эмодзи было удалено с сервера"
        },
        emojiUpdate: {
            name: "Изменение эмодзи",
            description: "Эмодзи было обновлено"
        },
        guildBanAdd: {
            name: "Бан участника",
            description: "Участник был забанен на сервере",
            bannedUser: "Забаненный участник"
        },
        guildBanRemove: {
            name: "Разбан участника",
            description: "Участник был разбанен на сервере",
            unbannedUser: "Разбаненный участник"
        },
        guildIntegrationsUpdate: {
            updateName: "Изменение интеграция",
            createName: "Создание интеграции",
            deleteName: "Удаление интеграции",
            updateDescription: "Интеграции были обновлены",
            createDescription: "Была создана интеграция",
            deleteDescription: "Интеграция была удалена"
        },
        guildMemberAdd: {
            memberJoinName: "Присоединение участника",
            memberJoinDescription: "Участник присоединился к серверу",
            botAddName: "Добавление бота",
            botAddDescription: "Бот был добавлен на сервер"
        },
        guildMemberRemove: {
            memberKickName: "Кик участника",
            memberKickDescription: "Участник был кикнут с сервера",
            memberLeaveName: "Выход участника",
            memberLeaveDescription: "Участник вышел с сервера",
            botKickName: "Кик бота",
            botKickDescription: "Бот был кикнут с сервера"
        },
        guildMemberUpdate: {
            name: "Изменение участника",
            description: "Участник был обновлён"
        },
        guildUpdate: {
            name: "Обновление сервера",
            description: "Настройки сервера были обновлены",
            afkChannelUpdate: "Изменение AFK канала",
            afkTimeoutUpdate: "Изменение AFK-таймаута",
            bannerUpdate: "Изменение баннера",
            notificationsUpdate: "Изменение типа упоминаний",
            discoverySplashUpdate: "Изменение баннера в Discovery",
            descriptionUpdate: "Изменение описание",
            explicitFilterUpdate: "Изменение фильтров взрослого контента",
            mfaLevelUpdate: "Изменение MFA уровня",
            nameUpdate: "Изменение имена",
            iconUpdate: "Изменение иконки",
            ownerUpdate: "Изменение владельца",
            partnerStatusUpdate: "Изменение статуса партнёрства",
            preferredLocaleUpdate: "Изменение предпочтительного языка",
            publicUpdatesChannelUpdate: "Изменение канала для публичных обновлений",
            regionUpdate: "Изменение региона",
            rulesChannelUpdate: "Изменение канала с правилами",
            splashUpdate: "Изменение заставки",
            systemChannelUpdate: "Изменение канала системных сообщений",
            systemChannelFlagsUpdate: "Изменение параметров канала системных сообщений",
            verificationLevelUpdate: "Изменение уровня верификации",
            verifiedStatusUpdate: "Изменение статуса верификации",
            widgetChannelUpdate: "Изменение виджета канала",
            widgetToggleUpdate: "Изменение виджета"
        },
        inviteCreate: {
            name: "Создание ссылки-приглашения",
            description: "Была создана ссылка-приглашения на сервер",
            expiresAt: "Истекает",
            maxAge: "Максимальный срок",
            maxUses: "Максимум использований",
            temporary: "Временная"
        },
        inviteDelete: {
            name: "Удаление ссылки-приглашения",
            description: "Была удалена ссылка-приглашения на сервер"
        },
        messageDelete: {
            name: "Удаление сообщения",
            description: "Было удалено сообщение",
            content: "Содержимое",
            attachment: "Вложения",
            pinned: "Было закреплено",
            webhookID: "ID вебхука",
            embeds: "Встроенные сообщения",
            reactions: "Реакции",
            createdAt: "Отправлено"
        },
        messageDeleteBulk: {
            name: "Массовое удаление сообщений",
            description: "**{%count%}** сообщений было удалено одновременно"
        },
        messageReactionRemoveAll: {
            name: "Удаление всех реакций",
            description: "Были удалены все реакции с сообщения"
        },
        messageUpdate: {
            name: "Изменение сообщения",
            description: "Было отредактировано сообщение",
            newContent: "Новое содержимое",
            oldContent: "Старое содержимое"
        },
        roleCreate: {
            name: "Создание роли",
            description: "Была создана новая роль"
        },
        roleDelete: {
            name: "Удаление роли",
            description: "Была удалена роль"
        },
        roleUpdate: {
            name: "Изменение настроек роли",
            description: "Были обновлены настройки роли"
        },
        voiceChannelJoin: {
            name: "Подключение к голосовому каналу",
            description: "Участник подключился к голосовому каналу"
        },
        voiceChannelLeave: {
            name: "Выход из голосового канала",
            description: "Участник вышел из голосового канала"
        },
        voiceChannelSwitch: {
            name: "Перемещение в другой голосовой канал",
            description: "Участник перешёл / был перемещён в другой голосовой канал",
            newVoiceChannel: "Новый канал",
            oldVoiceChannel: "Старый канал"
        },
        voiceStateUpdate: {
            name: "Изменения в голосовом канале",
            description: "Участник был обновлён в голосовом канале",
            memberMute: "Участнику был **выключен** микрофон",
            memberUnmute: "Участнику был **включен** микрофон",
            memberDefeat: "Участнику был **выключен** звук",
            memberUndefeat: "Участнику был **включен** звук",
        },
        webhookUpdate: {
            webhookCreateName: "Создание вебхука",
            webhookCreateDescription: "В канале был создан вебхук",
            webhookDeleteName: "Удаление вебхука",
            webhookDeleteDescription: "В канале был удалён вебхук",
            webhookUpdateName: "Изменение вебхука",
            webhookUpdateDescription: "В канале был изменен вебхук",
            nameUpdate: "Изменение имени",
            avatarUpdate: "Изменение аватарки",
            channelUpdate: "Изменение канала",
            token: "Токен",
            owner: "Владелец",
        },
        stickerCreate: {
            name: "Добавление стикера",
            description: "Стекер был добавлен"
        },
        stickerDelete: {
            name: "Удаление стикера",
            description: "Стикер был удалён"
        },
        stickerUpdate: {
            name: "Обновление стикера",
            description: "Стикер был обновлён"
        },
        threadCreate: {
            name: "Создание ветки",
            description: "Ветка была создана"
        },
        threadDelete: {
            name: "Удаление ветки",
            description: "Ветка была удалена"
        },
        threadUpdate: {
            name: "Обновление ветки",
            description: "Ветка была обновлена"
        }
    },
    permission: {
        ADMINISTRATOR: "Администратор",
        CREATE_INSTANT_INVITE: "Создавать ссылки-приглашения",
        KICK_MEMBERS: "Кикать участников",
        BAN_MEMBERS: "Банить участников",
        MANAGE_CHANNELS: "Управлять каналами",
        MANAGE_GUILD: "Управлять сервером",
        ADD_REACTIONS: "Добавлять реакции",
        VIEW_AUDIT_LOG: "Просматривать журнал аудита",
        PRIORITY_SPEAKER: "Приоритет в голосовых каналах",
        STREAM: "Стримить",
        VIEW_CHANNEL: "Видеть каналы",
        SEND_MESSAGES: "Отправлять сообщения",
        SEND_TTS_MESSAGES: "Отправлять TTS сообщения",
        MANAGE_MESSAGES: "Управлять сообщениями",
        EMBED_LINKS: "Встраивать ссылки",
        ATTACH_FILES: "Прикреплять файлы",
        READ_MESSAGE_HISTORY: "Читать историю сообщений",
        MENTION_EVERYONE: "Упоминать всех",
        USE_EXTERNAL_EMOJIS: "Использовать эмодзи с другого сервера",
        VIEW_GUILD_INSIGHTS: "Просматривать статистику сервера",
        CONNECT: "Подключаться",
        SPEAK: "Говорить",
        MUTE_MEMBERS: "Мьютить участников",
        DEAFEN_MEMBERS: "Отключать участникам микрофон",
        MOVE_MEMBERS: "Перемещать участников",
        USE_VAD: "Использовать режим активации по голосу",
        CHANGE_NICKNAME: "Изменять никнейм",
        MANAGE_NICKNAMES: "Управлять никнеймами",
        MANAGE_ROLES: "Управлять ролями",
        MANAGE_WEBHOOKS: "Управлять вебхуками",
        MANAGE_EMOJIS: "Управлять эмодзи"
    },
    overwrite: {
        member: "Участник",
        role: "Роль"
    },
    misc: {
        welcomeMessage: "Привет! Спасибо, что вы добавили меня сюда!\n" +
            "Присоединяйтесь к нашему серверу поддержки для получения помощи и информации {%url%}\n" +
            "Для настройки бота перейдите на сайт с панелью управления {%url2%}\n" +
            "Мой стандартный префикс \`!\`\n\n" +
            "Используйте команду \`!хелп\` для получения необходимой информации\n",
        createMuteRoleReason: "Создание роли для мьюта"
    },
    presenceStatus: {
        online: `${emoji.status.online.string} Онлайн`,
        offline: `${emoji.status.offline.string} Оффлайн`,
        dnd: `${emoji.status.dnd.string} Не беспокоить`,
        idle: `${emoji.status.idle.string} Отошёл`,
        streaming: `${emoji.status.streaming.string} Стримит`,
        unknown: `${emoji.status.unknown.string} Неизвестно`
    },
    activityType: {
        PLAYING: "Играет",
        STREAMING: "Стримит",
        LISTENING: "Слушает",
        WATCHING: "Смотрим",
        CUSTOM_STATUS: "Кастомный статус",
        COMPETING: "Соревнуется"
    },
    subscription: {
        twitch: {
            live: `${emoji.twitch.string} **{%user%}** запустил стрим на Twitch`,
            game: "Игра",
            watchNow: "Смотреть сейчас",
            clickHere: "[\`*Нажмите сюда для просмотра стрима*\`]({%url%})"
        },
        vk: {
            poll: `[📊 Опрос: {%question%}]({%url%})`,
            audio: `[🎵 Аудиозапись: {%artist%} - {%title%}]({%url%})`,
            album: `[💽 Альбом: {%title%}]({%url%})`,
            market: `[🛒 Товар: {%title%}]({%url%})`,
            marketAlbum: `[🛍️ Подборка товаров: {%title%}]({%url%})`
        }
    },
    verificationLevel: {
        NONE: "Отсутствует",
        LOW: "Низкий",
        MEDIUM: "Средний",
        HIGH: "Высокий",
        VERY_HIGH: "Наивысший"
    },
    rest: {
        page: "Страница",
        notFound: "Данные не найдены.",
        interactionExecutorError: "Взаимодействовать с этим может только тот, кто вызвал команду.",
        inputPageNumber: "Введите номер страницы (у вас 10 секунд на ответ).",
        inputPageWarning: "Если не ответить, дискорд покажет ошибку через время, но страница все равно будет изменена.",
        interactionTimeout: "Взаимодействие с этим больше невозможно (истекло время). Пожалуйста, запросите команду повторно.",
        dmModerationResponse: {
            warn: "Вам было выдано **предупреждение** на сервере",
            ban: "Вы были **забанены** на сервере",
            kick: "Вы были **выгнаны** с сервера",
            mute: "Вам был выдан **мьют** на сервере"
        }
    }
};

export default ru_RU;
