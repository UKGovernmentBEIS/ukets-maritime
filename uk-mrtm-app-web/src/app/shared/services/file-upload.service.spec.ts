import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { merge, Observable } from 'rxjs';

import { FileUuidDTO } from '@mrtm/api';

import { HttpStatuses } from '@netz/common/error';
import { testSchedulerFactory } from '@netz/common/testing';
import { MessageValidationErrors } from '@netz/govuk-components';

import { MAX_FILE_NAME_LENGTH } from '@shared/components';
import { FileUploadService, UPLOAD_FAILED_MESSAGE } from '@shared/services';
import { TestScheduler } from 'rxjs/testing';

describe('FileUploadService', () => {
  let service: FileUploadService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUploadService);
    testScheduler = testSchedulerFactory();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit validation error for a single file upload', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const input$ = cold<HttpEvent<FileUuidDTO>>('--a-b--c|', {
        a: { type: HttpEventType.UploadProgress, loaded: 5, total: 15 },
        b: { type: HttpEventType.UploadProgress, loaded: 10, total: 15 },
        c: new HttpResponse({ status: HttpStatuses.Ok, body: { uuid: 'abcd' } }),
      });
      const file = new File(['some content'], 'file.txt');

      expectObservable(
        service.upload(() => input$)(new FormControl({ file })) as Observable<MessageValidationErrors>,
      ).toBe('-------c|', { c: null });
      expectObservable(service.uploadProgress$).toBe('--a-b--c', {
        a: { file, progress: 5 / 15 },
        b: { file, progress: 10 / 15 },
        c: { file, progress: 1, uuid: 'abcd' },
      });
    });
  });

  it('should emit validation error for multiple files upload', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const fileA = new File(['some content'], 'file.txt');
      const fileB = new File(['some other content'], 'file2.txt');
      const fileC = new File(['some uploaded content'], 'file3.txt');
      const control = new FormControl([{ file: fileA }, { file: fileB }, { file: fileC, uuid: 'abcd' }]);
      const upload$ = vi.fn(() =>
        cold<HttpEvent<FileUuidDTO>>('--a---b------c|', {
          a: { type: HttpEventType.UploadProgress, loaded: 5, total: 15 },
          b: { type: HttpEventType.UploadProgress, loaded: 10, total: 15 },
          c: new HttpResponse({ status: HttpStatuses.Ok, body: { uuid: 'abcd' } }),
        }),
      );

      expectObservable(service.uploadMany(upload$)(control) as Observable<MessageValidationErrors>).toBe(
        '--------------(c|)',
        { c: null },
      );
      expectObservable(service.uploadProgress$).toBe('--(aa)(bb)---(cc)', {
        a: { file: fileA, progress: 5 / 15 },
        b: { file: fileB, progress: 10 / 15 },
        c: { file: fileA, progress: 1, uuid: 'abcd' },
      });
    });
  });

  it('should be valid when no file is attached', () => {
    testScheduler.run(({ expectObservable, flush }) => {
      const control = new FormControl(null);
      const request = vi.fn();

      expectObservable(service.upload(request)(control) as Observable<MessageValidationErrors>).toBe('(c|)', {
        c: null,
      });
      expectObservable(service.uploadProgress$).toBe('--');
      flush();
      expect(request).not.toHaveBeenCalled();
    });
  });

  it('should be valid when no files are attached', () => {
    testScheduler.run(({ expectObservable, flush }) => {
      const control = new FormControl([]);
      const request = vi.fn();

      expectObservable(service.uploadMany(request)(control) as Observable<MessageValidationErrors>).toBe('(c|)', {
        c: null,
      });
      expectObservable(service.uploadProgress$).toBe('----');
      flush();
      expect(request).not.toHaveBeenCalled();
    });
  });

  it('should report files whose name is too long instead of uploading them', () => {
    testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const file = new File(['some content'], 'a'.repeat(MAX_FILE_NAME_LENGTH + 1));
      const control = new FormControl([{ file }]);
      const upload$ = cold<HttpEvent<FileUuidDTO>>('--a|', {
        a: new HttpResponse({ status: HttpStatuses.Ok, body: { uuid: 'abcd' } }),
      });
      const errors = {
        'maxFileNameLength-0': `The selected file must have a name of ${MAX_FILE_NAME_LENGTH} characters or less`,
      };

      // The failure is reported on the progress stream synchronously, so listen to it before validating.
      expectObservable(service.uploadProgress$).toBe('a', { a: { file, progress: null, errors } });
      expectObservable(service.uploadMany(() => upload$)(control) as Observable<MessageValidationErrors>).toBe('(c|)', {
        c: { 'maxFileNameLength-0-0': errors['maxFileNameLength-0'] },
      });
      expectSubscriptions(upload$.subscriptions).toBe([]);
    });
  });

  it('should still upload the valid files when another file fails a per-file check', () => {
    testScheduler.run(({ cold, expectObservable, flush }) => {
      const tooLong = new File(['some content'], 'a'.repeat(MAX_FILE_NAME_LENGTH + 1));
      const empty = new File([], 'empty.txt');
      const valid = new File(['some content'], 'valid.txt');
      const control = new FormControl([{ file: tooLong }, { file: empty }, { file: valid }]);
      const upload$ = vi.fn(() =>
        cold<HttpEvent<FileUuidDTO>>('----a|', {
          a: new HttpResponse({ status: HttpStatuses.Ok, body: { uuid: 'abcd' } }),
        }),
      );
      const tooLongErrors = {
        'maxFileNameLength-0': `The selected file must have a name of ${MAX_FILE_NAME_LENGTH} characters or less`,
      };
      const emptyErrors = { 'notEmpty-0': 'The selected file should not be empty' };

      expectObservable(service.uploadProgress$).toBe('(ab)c', {
        a: { file: tooLong, progress: null, errors: tooLongErrors },
        b: { file: empty, progress: null, errors: emptyErrors },
        c: { file: valid, progress: 1, uuid: 'abcd' },
      });
      expectObservable(service.uploadMany(upload$)(control) as Observable<MessageValidationErrors>).toBe('-----(c|)', {
        c: {
          'maxFileNameLength-0-0': tooLongErrors['maxFileNameLength-0'],
          'notEmpty-0-1': emptyErrors['notEmpty-0'],
        },
      });
      flush();
      expect(upload$).toHaveBeenCalledTimes(1);
      expect(upload$).toHaveBeenCalledWith(valid);
    });
  });

  it('should emit file upload events from various validations', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const controlA = new FormControl({ file: new File(['some content'], 'single-file.txt') });
      const controlB = new FormControl([
        { file: new File(['first content'], 'first-file.txt') },
        { file: new File(['second content'], 'second-file.txt') },
      ]);
      const error = new HttpErrorResponse({
        status: HttpStatuses.BadRequest,
        statusText: 'Bad request',
        error: { message: 'File upload failed' },
      });
      const upload$ = vi.fn((file: File) =>
        file.name === 'second-file.txt'
          ? cold<HttpEvent<FileUuidDTO>>(
              '--a----#',
              { a: { type: HttpEventType.UploadProgress, loaded: 5, total: 15 } },
              error,
            )
          : cold<HttpEvent<FileUuidDTO>>('--a----b------c|', {
              a: { type: HttpEventType.UploadProgress, loaded: 5, total: 15 },
              b: { type: HttpEventType.UploadProgress, loaded: 10, total: 15 },
              c: new HttpResponse({ status: HttpStatuses.Ok, body: { uuid: 'abcd' } }),
            }),
      );

      expectObservable(
        merge(
          service.upload(upload$)(controlA),
          service.uploadMany(upload$)(controlB),
        ) as Observable<MessageValidationErrors>,
      ).toBe('--------------a(b|)', { a: null, b: { 'upload-1': UPLOAD_FAILED_MESSAGE } });

      expectObservable(service.uploadProgress$).toBe('--(abc)(def)--(gh)--', {
        a: { file: controlA.value.file, progress: 5 / 15 },
        b: { file: controlB.value[0].file, progress: 5 / 15 },
        c: { file: controlB.value[1].file, progress: 5 / 15 },
        d: { file: controlA.value.file, progress: 10 / 15 },
        e: { file: controlB.value[0].file, progress: 10 / 15 },
        f: {
          file: controlB.value[1].file,
          progress: null,
          errors: { upload: UPLOAD_FAILED_MESSAGE },
        },
        g: { file: controlA.value.file, progress: 1, uuid: 'abcd' },
        h: { file: controlB.value[0].file, progress: 1, uuid: 'abcd' },
      });
    });
  });
});
