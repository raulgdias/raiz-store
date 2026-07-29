import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { DomainError, type DomainErrorKind } from "../domain/domain.error";

interface HttpResponse {
  status(code: number): HttpResponse;
  json(body: { statusCode: number; message: string; error: string }): void;
}

const statusByKind: Record<DomainErrorKind, number> = {
  VALIDATION: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter<DomainError> {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();
    const statusCode = statusByKind[exception.kind];
    response.status(statusCode).json({
      statusCode,
      message: exception.message,
      error: exception.kind,
    });
  }
}
