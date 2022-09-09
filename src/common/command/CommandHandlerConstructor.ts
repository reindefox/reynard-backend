export interface CommandHandlerConstructor {
    register(): Promise<void>;
}
