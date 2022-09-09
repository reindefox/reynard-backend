import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { constants } from "http2";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    public catch(exception: any, host: ArgumentsHost): any {
        host.switchToHttp()?.getResponse()?.status(constants.HTTP_STATUS_NOT_FOUND);
    }
}
