import { FormControl } from '@angular/forms';

import { MessageValidationErrors, MessageValidatorFn } from '@netz/govuk-components';

import { FileValidators, MAX_FILE_NAME_LENGTH } from '@shared/components';

describe('FileValidators', () => {
  it('should create an instance', () => {
    expect(new FileValidators()).toBeTruthy();
  });

  it('should concatenate the errors of several files', () => {
    const errors: MessageValidationErrors[] = [
      {
        upload: 'An upload has failed',
        test: 'A test has failed',
        random: 'A random error',
      },
      {
        upload: 'Another upload has failed',
      },
    ];

    expect(FileValidators.concatenateErrors(errors)).toEqual({
      'upload-0': 'An upload has failed',
      'test-0': 'A test has failed',
      'random-0': 'A random error',
      'upload-1': 'Another upload has failed',
    });
  });

  it('should apply a single file validator to multiple files', () => {
    const validator: MessageValidatorFn = (control) =>
      control.value.uuid ? null : { required: 'The file is required' };
    const formControl = new FormControl();
    formControl.setValue([{ uuid: 1 }, { uuid: null }]);

    expect(FileValidators.multipleCompose(validator)(formControl)).toEqual({ 'required-1': 'The file is required' });
  });

  it('should limit the file size to given amount', () => {
    const formControl = new FormControl(
      { file: { name: 'Test file', size: 1024 * 1024 } },
      { validators: FileValidators.maxFileSize(2) },
    );

    expect(formControl.errors).toBeNull();
    expect(formControl.valid).toBeTruthy();

    formControl.setValue({ file: { name: 'Test file', size: 3 * 1024 * 1024 } });
    expect(formControl.errors).toEqual({ ['maxFileSize-0']: 'The selected file must be smaller than 2MB' });
    expect(formControl.invalid).toBeTruthy();
  });

  it('should limit the file name length to given amount', () => {
    const formControl = new FormControl(
      { file: { name: 'a'.repeat(255) + '.txt', size: 1024 } },
      { validators: FileValidators.maxFileNameLength(259) },
    );

    expect(formControl.errors).toBeNull();
    expect(formControl.valid).toBeTruthy();

    formControl.setValue({ file: { name: 'a'.repeat(256) + '.txt', size: 1024 } });
    expect(formControl.errors).toEqual({
      ['maxFileNameLength-0']: 'The selected file must have a name of 259 characters or less',
    });
    expect(formControl.invalid).toBeTruthy();
  });

  it('should default the file name length limit to MAX_FILE_NAME_LENGTH characters', () => {
    const formControl = new FormControl(
      { file: { name: 'a'.repeat(MAX_FILE_NAME_LENGTH), size: 1024 } },
      { validators: FileValidators.maxFileNameLength() },
    );

    expect(formControl.errors).toBeNull();

    formControl.setValue({ file: { name: 'a'.repeat(MAX_FILE_NAME_LENGTH + 1), size: 1024 } });
    expect(formControl.errors).toEqual({
      ['maxFileNameLength-0']: `The selected file must have a name of ${MAX_FILE_NAME_LENGTH} characters or less`,
    });
  });

  it('should validate the file name length of every file in a list', () => {
    const formControl = new FormControl(
      [
        { file: { name: 'short.txt', size: 1024 } },
        { file: { name: 'a'.repeat(MAX_FILE_NAME_LENGTH + 1), size: 1024 } },
      ],
      { validators: FileValidators.maxFileNameLength() },
    );

    expect(formControl.errors).toEqual({
      ['maxFileNameLength-1']: `The selected file must have a name of ${MAX_FILE_NAME_LENGTH} characters or less`,
    });
  });
});
