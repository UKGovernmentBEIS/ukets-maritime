import { HttpErrorResponse } from '@angular/common/http';

import { catchError, Observable, pipe, throwError, UnaryFunction } from 'rxjs';

import { HttpStatus, HttpStatuses } from '../http-status';

export function catchElseRethrow<T, R, E = HttpErrorResponse>(
  predicate: UnaryFunction<E, boolean>,
  handler: UnaryFunction<E, Observable<R>>,
) {
  return pipe(
    catchError<T, Observable<R | never>>((res: E) => (predicate(res) ? handler(res) : throwError(() => res))),
  );
}

export function catchBadRequest(
  code: ErrorCodes | ErrorCodes[] | string,
  handler: (res: HttpErrorResponse) => Observable<any>,
) {
  return pipe(
    catchElseRethrow((res) => {
      return isBadRequest(res, code);
    }, handler),
  );
}

export function catchTaskReassignedBadRequest(handler: (res: HttpErrorResponse) => Observable<any>) {
  return catchBadRequest('REQUEST_TASK_ACTION1001', handler);
}

export function catchTaskUnsafeFileRequest() {
  return pipe(
    catchError((res: HttpErrorResponse) => {
      const modifiedResponse: HttpErrorResponse = {
        ...res,
        status: HttpStatuses.BadRequest,
        error: {
          code: ErrorCodes.FILE1004,
          message: 'File upload failed',
          security: true,
          data: [[]],
        },
      };
      return throwError(() => modifiedResponse);
    }),
  );
}

export function isBadRequest(res: unknown, codes?: ErrorCodes | ErrorCodes[] | string): res is BadRequest {
  return (
    res instanceof HttpErrorResponse &&
    res.status === 400 &&
    (codes === undefined ||
      (typeof codes === 'string' && codes === res.error.code) ||
      (Array.isArray(codes) && codes.includes(res.error.code)))
  );
}

export class ErrorCodes {
  static ACCOUNT1001: string = 'ACCOUNT1001';
  static ACCOUNT1004: string = 'ACCOUNT1004';
  static ACCOUNT1005: string = 'ACCOUNT1005';
  static ACCOUNT1006: string = 'ACCOUNT1006';
  static ACCOUNT1007: string = 'ACCOUNT1007';
  static ACCOUNT1010: string = 'ACCOUNT1010';
  static ACCOUNT_CONTACT1001: string = 'ACCOUNT_CONTACT1001';
  static ACCOUNT_CONTACT1002: string = 'ACCOUNT_CONTACT1002';
  static ACCOUNT_CONTACT1003: string = 'ACCOUNT_CONTACT1003';
  static AUTHORITY1001: string = 'AUTHORITY1001';
  static AUTHORITY1003: string = 'AUTHORITY1003';
  static AUTHORITY1004: string = 'AUTHORITY1004';
  static AUTHORITY1005: string = 'AUTHORITY1005';
  static AUTHORITY1006: string = 'AUTHORITY1006';
  static AUTHORITY1007: string = 'AUTHORITY1007';
  static AUTHORITY1013: string = 'AUTHORITY1013';
  static AUTHORITY1014: string = 'AUTHORITY1014';
  static AUTHORITY1015: string = 'AUTHORITY1015';
  static AUTHORITY1016: string = 'AUTHORITY1016';
  static EMAIL1001: string = 'EMAIL1001';
  static EXTCONTACT1000: string = 'EXTCONTACT1000';
  static EXTCONTACT1001: string = 'EXTCONTACT1001';
  static EXTCONTACT1002: string = 'EXTCONTACT1002';
  static EXTCONTACT1003: string = 'EXTCONTACT1003';
  static FILE1004: string = 'FILE1004';
  static OTP1001: string = 'OTP1001';
  static REQUEST_TASK_ACTION1000: string = 'REQUEST_TASK_ACTION1000';
  static REQUEST_TASK_ACTION1001: string = 'REQUEST_TASK_ACTION1001';
  static TOKEN1001: string = 'TOKEN1001';
  static USER1001: string = 'USER1001';
  static USER1003: string = 'USER1003';
  static USER1004: string = 'USER1004';
  static USER1005: string = 'USER1005';
  static VERBODY1001: string = 'VERBODY1001';
  static VERBODY1002: string = 'VERBODY1002';
  static VERBODY1003: string = 'VERBODY1003';
  static NOTIF1000: string = 'NOTIF1000';
  static NOTIF1001: string = 'NOTIF1001';
  static NOTIF1002: string = 'NOTIF1002';
  static NOTIF1003: string = 'NOTIF1003';
  static REPORT1001: string = 'REPORT1001';
  static FORM1001: string = 'FORM1001';
  static BATCHREISSUE0001: string = 'BATCHREISSUE0001';
  static BATCHREISSUE0002: string = 'BATCHREISSUE0002';
  static AER1008: string = 'AER1008';
  static NOTFOUND1001: string = 'NOTFOUND1001';
  static THIRDPARTYDATAPROVIDER1000: string = 'THIRDPARTYDATAPROVIDER1000';
  static THIRDPARTYDATAPROVIDER1001: string = 'THIRDPARTYDATAPROVIDER1001';
  static THIRDPARTYDATAPROVIDER1002: string = 'THIRDPARTYDATAPROVIDER1002';
}

export interface BadRequest extends HttpErrorResponse {
  status: HttpStatus;
  error: {
    code: string;
    data: unknown;
  };
}
