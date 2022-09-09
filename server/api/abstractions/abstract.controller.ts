import { BaseAbstractController } from "@server/api/abstractions/BaseAbstractController";

export abstract class AbstractController extends BaseAbstractController {
    public static readonly requestUrl: string = "https://discord.com/api/";
}
