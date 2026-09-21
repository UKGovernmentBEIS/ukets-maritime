import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Service } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

import {
  catchError,
  defaultIfEmpty,
  defer,
  filter,
  forkJoin,
  iif,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  tap,
} from 'rxjs';

import { FileUuidDTO } from '@mrtm/api';

import { MessageValidationErrors, MessageValidatorFn } from '@netz/govuk-components';

import { commonFileValidators, FileValidators } from '@shared/components/file-input/file-validators';
import { FileUploadEvent } from '@shared/types';

export const UPLOAD_FAILED_MESSAGE = 'The selected file upload failed';

export type FileUploadRequest<T = FileUuidDTO> = (file: File) => Observable<HttpEvent<T>>;

@Service()
export class FileUploadService {
  private readonly uploadProgressSubject = new Subject<FileUploadEvent>();
  readonly uploadProgress$ = this.uploadProgressSubject.asObservable();

  upload(request: FileUploadRequest): AsyncValidatorFn {
    const requestUpload = this.requestUpload(request);

    return ({ value }: AbstractControl) => {
      const file = (value as FileUploadEvent)?.file;

      return !file || this.isFileAlreadyUploaded(value) ? of(null) : requestUpload(file);
    };
  }

  /**
   * Uploads every file of the control that is not uploaded yet.
   *
   * The per-file checks (size, empty, name length) run in here rather than as sync validators of the control on
   * purpose: Angular does not run async validators while a sync validator fails, so a sync per-file check would block
   * the upload of every other file as soon as one of them is invalid. Files failing a check are reported with the same
   * `validator-index` error keys the sync validators would produce, and on `uploadProgress$`, while the remaining files
   * are still uploaded.
   */
  uploadMany(
    request: FileUploadRequest,
    fileValidators: MessageValidatorFn[] = commonFileValidators,
  ): AsyncValidatorFn {
    const requestUpload = this.requestUpload(request);

    // Cache files that already have been attempted to be uploaded, to avoid replays of errored or in progress files
    const attempts = new WeakMap<File, Observable<MessageValidationErrors>>();

    return ({ value }: AbstractControl) =>
      iif(
        () => (value ?? []).map((file) => this.isFileAlreadyUploaded(file)).filter((val) => !val).length > 10,
        of({ toManyFiles: 'You can only select up to 10 files at the same time' }),
        forkJoin(
          ((value ?? []) as FileUploadEvent[]).map((fileEvent) => {
            if (!attempts.has(fileEvent.file)) {
              attempts.set(
                fileEvent.file,
                this.validateOrUpload(fileEvent, fileValidators, requestUpload).pipe(
                  shareReplay({ bufferSize: 1, refCount: false }),
                ),
              );
            }

            return attempts.get(fileEvent.file);
          }),
        ).pipe(map(FileValidators.concatenateErrors), defaultIfEmpty(null)),
      );
  }

  private requestUpload(request: FileUploadRequest): (file: File) => Observable<MessageValidationErrors | null> {
    return (file: File) =>
      request(file).pipe(
        filter((event) => [HttpEventType.UploadProgress, HttpEventType.Response].includes(event.type)),
        tap({
          next: (event) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.uploadProgressSubject.next({ progress: event.loaded / event.total, file });
                break;
              case HttpEventType.Response:
                this.uploadProgressSubject.next({ progress: 1, file, uuid: event.body.uuid });
                break;
            }
          },
          error: () =>
            this.uploadProgressSubject.next({
              progress: null,
              file,
              errors: this.createValidationError(),
            }),
        }),
        filter((event) => event.type === HttpEventType.Response),
        map(() => null),
        catchError(() => of(this.createValidationError())),
      );
  }

  private validateOrUpload(
    fileEvent: FileUploadEvent,
    fileValidators: MessageValidatorFn[],
    requestUpload: (file: File) => Observable<MessageValidationErrors | null>,
  ): Observable<MessageValidationErrors | null> {
    if (this.isFileAlreadyUploaded(fileEvent)) {
      return of(null);
    }

    const errors = this.validateFile(fileEvent, fileValidators);

    if (!errors) {
      return requestUpload(fileEvent.file);
    }

    // Report the failure on the progress stream as well, so a file list can show it next to the file the same way it
    // shows a failed upload, without having to wait for the control's validation to settle.
    return defer(() => {
      this.uploadProgressSubject.next({ file: fileEvent.file, progress: null, errors });

      return of(errors);
    });
  }

  private validateFile(fileEvent: FileUploadEvent, fileValidators: MessageValidatorFn[]): MessageValidationErrors {
    const errors = fileValidators.reduce((acc, validator) => {
      const next = validator({ value: fileEvent } as AbstractControl);
      return next ? { ...acc, ...next } : acc;
    }, {} as MessageValidationErrors);

    return Object.keys(errors).length > 0 ? errors : null;
  }

  private isFileAlreadyUploaded({ file, uuid }: FileUploadEvent): boolean {
    return !(file instanceof File) || !!uuid;
  }

  // The list already shows the file name next to the error, and the server's message is not user-facing copy.
  private createValidationError(): MessageValidationErrors {
    return { upload: UPLOAD_FAILED_MESSAGE };
  }
}
