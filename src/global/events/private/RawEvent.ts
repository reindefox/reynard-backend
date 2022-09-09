import { AbstractEventOptions } from "@src/common/abstractions/event/interfaces/Event";
import { AbstractEvent } from "@src/common/abstractions/event/model/AbstractEvent";
import { createErrorLog } from "@src/scripts/Logger";
import { Message, MessageReaction, TextChannel, User } from "discord.js";

export default class RawEvent extends AbstractEvent {
    public static readonly options: AbstractEventOptions = {
        keyName: "raw",
    };

    constructor() {
        super(RawEvent.options);
    }

    public async run(event: any): Promise<void> {
        // Uncomment this, if there is need in reaction events in future
        // if (!event) return;
        //
        // switch (event.t) {
        //     case "MESSAGE_REACTION_ADD": {
        //         this.emitReactionEvent(event, "messageReactionAdd");
        //         break;
        //     }
        //     case "MESSAGE_REACTION_REMOVE": {
        //         this.emitReactionEvent(event, "messageReactionRemove");
        //         break;
        //     }
        //     default: {
        //         break;
        //     }
        // }
    }

    private emitReactionEvent(event: any, eventName: string): void {
        const reactionChannel: TextChannel = <TextChannel>this.client.channels.cache.get(event.d.channel_id);

        if (!reactionChannel) {
            return;
        }

        if (reactionChannel.messages.cache.has(event.d.message_id)) {
            return;
        }

        reactionChannel.messages.fetch(event.d.message_id)
            .then((message: Message) => {
                if (!message) return;

                const messageReaction: MessageReaction = this.messageReactionEmojiCache(message, event);
                const user: User = this.client.users.cache.get(event.d.user_id);

                if (!messageReaction || !user) return;

                this.client.emit(eventName, messageReaction, user);
            })
            .catch(e => createErrorLog(e, __filename));
    }

    private messageReactionEmojiCache(message: Message, event: any): MessageReaction {
        return message.reactions.cache.get(event.d.emoji.id) !== null
            ? message.reactions.cache.find(e => e.emoji.id === event.d.emoji.id)
            : message.reactions.cache.find(e => e.emoji.name === event.d.emoji.name);
    }
}
