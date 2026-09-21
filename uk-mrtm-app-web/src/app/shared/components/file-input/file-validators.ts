import { ValidatorFn } from '@angular/forms';

import { GovukValidators, MessageValidationErrors, MessageValidatorFn } from '@netz/govuk-components';

import { FileUploadEvent } from '@shared/types';

export const MAX_FILE_NAME_LENGTH = 255;

export class FileValidators {
  static maxFileSize(max: number, message = `The selected file must be smaller than ${max}MB`): MessageValidatorFn {
    return ({ value }: { value: FileUploadEvent | FileUploadEvent[] }) => {
      const valueIsArray = value && value instanceof Array && value.length > 0;
      const values: FileUploadEvent[] = (valueIsArray ? value : [value]) as FileUploadEvent[];

      const messages = values.reduce((acc, event, idx) => {
        const errorMessage = event?.file?.size >= max * 1024 * 1024 ? message : null;
        return errorMessage ? { ...acc, [`maxFileSize-${idx}`]: errorMessage } : acc;
      }, {});
      return Object.keys(messages).length > 0 ? messages : null;
    };
  }

  static notEmpty(message = 'The selected file should not be empty'): MessageValidatorFn {
    return ({ value }: { value: FileUploadEvent | FileUploadEvent[] }) => {
      const valueIsArray = value && value instanceof Array && value.length > 0;
      const values: FileUploadEvent[] = (valueIsArray ? value : [value]) as FileUploadEvent[];

      const messages = values.reduce((acc, event, idx) => {
        const messageItem = event?.file?.size === 0 ? message : null;
        return messageItem ? { ...acc, [`notEmpty-${idx}`]: messageItem } : acc;
      }, {});
      return Object.keys(messages).length > 0 ? messages : null;
    };
  }

  static maxFileNameLength(
    max: number = MAX_FILE_NAME_LENGTH,
    message: string = `The selected file must have a name of ${max} characters or less`,
  ): MessageValidatorFn {
    return ({ value }: { value: FileUploadEvent | FileUploadEvent[] }) => {
      const valueIsArray = value && value instanceof Array && value.length > 0;
      const values: FileUploadEvent[] = (valueIsArray ? value : [value]) as FileUploadEvent[];

      const messages = values.reduce((acc, event, idx) => {
        const errorMessage = event?.file?.name?.length > max ? message : null;
        return errorMessage ? { ...acc, [`maxFileNameLength-${idx}`]: errorMessage } : acc;
      }, {});
      return Object.keys(messages).length > 0 ? messages : null;
    };
  }

  static validContentTypes(
    types: string[],
    message: string = 'The selected file must be a supported file type',
  ): MessageValidatorFn {
    return ({ value }: { value: FileUploadEvent | FileUploadEvent[] }) => {
      const valueIsArray = value && value instanceof Array && value.length > 0;
      const values: FileUploadEvent[] = (valueIsArray ? value : [value]) as FileUploadEvent[];

      const messages = values.reduce((acc, event, idx) => {
        const fileType = event?.file?.type;

        const errorMessage = fileType && !types.includes(fileType) ? message : null;
        return errorMessage ? { ...acc, [`validContentTypes-${idx}`]: errorMessage } : acc;
      }, {});
      return Object.keys(messages).length > 0 ? messages : null;
    };
  }

  static maxImageDimensionsSize(
    maxWidth: number,
    maxHeight: number,
    message = `The selected file must be smaller than ${maxWidth}x${maxHeight} px`,
  ): MessageValidatorFn {
    return ({ value }: { value: FileUploadEvent | FileUploadEvent[] }) => {
      const valueIsArray = value && value instanceof Array && value.length > 0;
      const values: FileUploadEvent[] = (valueIsArray ? value : [value]) as FileUploadEvent[];

      const messages = values
        .filter((val) => !!val?.dimensions && (val.dimensions.width || val.dimensions.height))
        .reduce((acc, event, idx) => {
          const dim = event.dimensions;

          const areInvalidDimensions = dim?.width > maxWidth || dim?.height > maxHeight;
          const errorMessage = areInvalidDimensions ? message : null;
          return errorMessage ? { ...acc, [`dimensions-${idx}`]: errorMessage } : acc;
        }, {});
      return Object.keys(messages).length > 0 ? messages : null;
    };
  }

  static concatenateErrors(errors: MessageValidationErrors[] = []): MessageValidationErrors {
    return errors?.every((error) => error === null)
      ? null
      : errors.reduce(
          (result, error, index) => ({
            ...result,
            ...(error &&
              Object.entries(error).reduce((acc, [key, value]) => ({ ...acc, [`${key}-${index}`]: value }), {})),
          }),
          {},
        );
  }

  static multipleCompose(
    validator: ({ value }: { value: FileUploadEvent }) => MessageValidationErrors,
  ): MessageValidatorFn {
    return (control) => {
      const value: FileUploadEvent[] | null = control.value;
      const fileValidities = value?.map((fileEvent) => validator({ value: fileEvent }));

      return this.concatenateErrors(fileValidities);
    };
  }
}

export const commonFileValidators: MessageValidatorFn[] = [
  FileValidators.maxFileSize(20),
  FileValidators.notEmpty(),
  FileValidators.maxFileNameLength(),
];
export const requiredFileValidator = (requiredMessage: string = 'Select a file') =>
  GovukValidators.required(requiredMessage);

/**
 * Creates an array of common file validators, optionally including a required file validator.
 *
 * @param {boolean} isRequired - Specifies whether the file validator should include a required file check.
 * @param {string} [requiredMessage] - Optional custom message to be used for the required file validator.
 */
export const createCommonFileValidators = (isRequired: boolean, requiredMessage?: string): ValidatorFn[] => {
  return commonFileValidators.concat(isRequired ? [requiredFileValidator(requiredMessage)] : []);
};

/**
 * Sync validators for a control holding multiple files. The per-file checks of `commonFileValidators` are deliberately
 * left out: Angular skips async validators while a sync validator fails, so one invalid file would block the upload of
 * all the others. `FileUploadService.uploadMany` applies the per-file checks per file instead.
 *
 * @param {boolean} isRequired - Indicates whether the file input is mandatory.
 * @param {string} [requiredMessage] - Optional message to display if the required validator fails.
 */
export const createMultipleFileValidators = (isRequired: boolean, requiredMessage?: string): ValidatorFn[] => {
  return isRequired ? [requiredFileValidator(requiredMessage)] : [];
};
