import { HttpErrorResponse } from '@angular/common/http';

import { Observable, pipe } from 'rxjs';

import { catchElseRethrow, ErrorCodes } from './business-error';

export function catchNotFoundRequest(
  code: ErrorCodes | ErrorCodes[],
  handler: (res: HttpErrorResponse) => Observable<any>,
) {
  return pipe(catchElseRethrow((res) => isNotFoundRequest(res, code), handler));
}

export function isNotFoundRequest(res: unknown, codes?: ErrorCodes | ErrorCodes[]): res is NotFoundRequest {
  return (
    res instanceof HttpErrorResponse &&
    res.status === 404 &&
    (codes === undefined ||
      (typeof codes === 'string' && codes === res.error.code) ||
      (Array.isArray(codes) && codes.includes(res.error.code)))
  );
}

export interface NotFoundRequest extends HttpErrorResponse {
  status: 404;
  error: {
    code: ErrorCodes;
    data: unknown;
  };
}
