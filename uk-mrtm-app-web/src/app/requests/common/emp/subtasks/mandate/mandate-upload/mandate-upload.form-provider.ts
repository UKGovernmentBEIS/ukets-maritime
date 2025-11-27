import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EmpRegisteredOwner, RegisteredOwnerShipDetails } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { TASK_FORM } from '@requests/common';
import { csvFieldInconsistentRegisteredOwnersValidator } from '@requests/common/emp/subtasks/mandate/mandate-upload/csv-field-inconsistent-registered-owners.validator';
import { csvFieldMandateShip } from '@requests/common/emp/subtasks/mandate/mandate-upload/csv-field-mandate-ship.validator';
import {
  FlattenedRegisteredOwner,
  mandateCsvMap,
  MandateUploadCSVFormModel,
  MandateUploadFormModel,
} from '@requests/common/emp/subtasks/mandate/mandate-upload/mandate-upload.map';
import { FileType } from '@shared/constants';
import {
  csvColumnDiffValidator,
  csvFieldDateValidator,
  csvFieldDuplicateValidator,
  csvFieldEmailValidator,
  csvFieldMaxLengthValidator,
  csvFieldPatternValidator,
  csvFieldRequiredValidator,
  csvFieldTodayOrPastDateValidator,
  csvRowsEmptyValidator,
  csvRowsLengthValidator,
  emptyFileValidator,
  fileExtensionValidator,
  fileNameLengthValidator,
  fileRequiredValidator,
  maxFileSizeValidator,
} from '@shared/validators';

export const mandateUploadFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder],
  useFactory: (fb: FormBuilder) => {
    return fb.group<MandateUploadCSVFormModel>({
      owners: fb.array([] as FormGroup<MandateUploadFormModel>[]),
      columns: fb.control(null, {
        updateOn: 'change',
        validators: [csvColumnDiffValidator(mandateCsvMap)],
      }),
      file: fb.control(null, {
        updateOn: 'change',
        validators: [
          fileExtensionValidator(['csv'], FileType.CSV, 'The selected file must be a CSV'),
          maxFileSizeValidator(20, 'The selected file must be smaller than 20MB'),
          fileNameLengthValidator(100, 'The selected file must have a file name length less than 100 characters'),
          emptyFileValidator('The selected file cannot be empty'),
          fileRequiredValidator('Upload the registered owners file'),
        ],
      }),
    });
  },
};

export const addMandateFormGroup = (owner: FlattenedRegisteredOwner): FormGroup<MandateUploadFormModel> => {
  return new FormGroup<MandateUploadFormModel>({
    name: new FormControl<EmpRegisteredOwner['name']>(owner?.name),
    imoNumber: new FormControl<EmpRegisteredOwner['imoNumber']>(owner?.imoNumber),
    contactName: new FormControl<EmpRegisteredOwner['contactName']>(owner?.contactName),
    email: new FormControl<EmpRegisteredOwner['email']>(owner?.email),
    effectiveDate: new FormControl<EmpRegisteredOwner['effectiveDate']>(owner?.effectiveDate),
    shipImoNumber: new FormControl<RegisteredOwnerShipDetails['imoNumber']>(owner?.shipImoNumber),
  });
};

export const uploadMandateCSVFormValidators = (store: RequestTaskStore) => {
  return [
    csvRowsEmptyValidator(),
    csvRowsLengthValidator(1000, 'The maximum number of entries allowed in the file is 1000'),

    // registered owner details
    csvFieldInconsistentRegisteredOwnersValidator(),

    // name
    csvFieldRequiredValidator<FlattenedRegisteredOwner>(
      'name',
      mandateCsvMap,
      'The registered owner name is missing. Enter the registered owner name and reupload the file',
    ),
    csvFieldMaxLengthValidator<FlattenedRegisteredOwner>(
      'name',
      mandateCsvMap,
      255,
      'The registered owner name must be 255 characters or less. Enter the registered owner name and reupload the file',
    ),

    // imoNumber
    csvFieldRequiredValidator<FlattenedRegisteredOwner>(
      'imoNumber',
      mandateCsvMap,
      'The IMO number is missing. Enter the IMO number and reupload the file',
    ),
    csvFieldPatternValidator<FlattenedRegisteredOwner>(
      'imoNumber',
      mandateCsvMap,
      new RegExp(/^\d{7}$/),
      `The IMO number must be 7 digits long. Enter the IMO number and reupload the file`,
    ),

    // contactName
    csvFieldRequiredValidator<FlattenedRegisteredOwner>(
      'contactName',
      mandateCsvMap,
      `The registered owner's contact name is missing. Enter the contact name and reupload the file`,
    ),
    csvFieldMaxLengthValidator<FlattenedRegisteredOwner>(
      'contactName',
      mandateCsvMap,
      255,
      'The contact name must be 255 characters or less. Enter the contact name and reupload the file',
    ),

    // email
    csvFieldRequiredValidator<FlattenedRegisteredOwner>(
      'email',
      mandateCsvMap,
      'The contact email is missing. Enter the contact email and reupload the file',
    ),
    csvFieldEmailValidator<FlattenedRegisteredOwner>(
      'email',
      mandateCsvMap,
      'The contact email is not in the correct format. Enter an email address in the correct format, like name@example.com, and reupload the file',
      false,
    ),

    // effectiveDate
    csvFieldRequiredValidator<FlattenedRegisteredOwner>(
      'effectiveDate',
      mandateCsvMap,
      'The date of written agreement is missing. Enter the date of written agreement and reupload the file',
    ),
    csvFieldDateValidator<FlattenedRegisteredOwner>(
      'effectiveDate',
      mandateCsvMap,
      'The date of written agreement is not in the correct format. Enter the date of written agreement and reupload the file',
    ),
    csvFieldTodayOrPastDateValidator<FlattenedRegisteredOwner>(
      'effectiveDate',
      mandateCsvMap,
      'The date of written agreement must be today or in the past. Enter the date of written agreement and reupload the file',
    ),

    // shipImoNumber
    csvFieldRequiredValidator<FlattenedRegisteredOwner>(
      'shipImoNumber',
      mandateCsvMap,
      'The ship IMO number is missing. Enter the ship IMO number and reupload the file',
    ),
    csvFieldPatternValidator<FlattenedRegisteredOwner>(
      'shipImoNumber',
      mandateCsvMap,
      new RegExp(/^\d{7}$/),
      `The ship IMO number must be 7 digits long. Enter the ship IMO number and reupload the file`,
    ),
    csvFieldDuplicateValidator<FlattenedRegisteredOwner>(
      'shipImoNumber',
      mandateCsvMap,
      'There are duplicated ship IMO numbers in the file. Check the information entered and reupload the file',
      true,
    ),
    csvFieldMandateShip<FlattenedRegisteredOwner>(
      'shipImoNumber',
      mandateCsvMap,
      store,
      'The ship IMO number contains values that are inconsistent with the information provided in the Ship details. Check the information entered and reupload the file',
    ),
  ];
};
