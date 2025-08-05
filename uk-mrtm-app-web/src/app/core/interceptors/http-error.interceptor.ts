import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, Observable } from 'rxjs';

import { GlobalErrorHandlingService } from '@core/services';

export function httpErrorInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const globalErrorHandlingService = inject(GlobalErrorHandlingService);
  return next(request).pipe(catchError((res: HttpErrorResponse) => globalErrorHandlingService.handleHttpError(res)));
}
