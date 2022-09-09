import { BadRequestException } from "@nestjs/common";

export class BodyMissingException extends BadRequestException {
    constructor() {
        super({
            message: "Body parameter is missing."
        });
    }
}
