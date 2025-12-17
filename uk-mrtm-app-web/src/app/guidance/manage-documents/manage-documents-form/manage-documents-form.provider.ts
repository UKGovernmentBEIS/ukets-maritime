import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isNil } from 'lodash-es';

import { GuidanceDocumentDTO, GuidanceDocumentsService } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { MANAGE_GUIDANCE_FORM } from '@guidance/guidance.constants';
import { ManageGuidanceDocumentDTO } from '@guidance/guidance.types';
import { ManageDocumentsFormGroupModel } from '@guidance/manage-documents/manage-documents-form/manage-documents-form.types';
import { createCommonFileValidators } from '@shared/components';
import { FileUploadService } from '@shared/services';

const uniqueDocumentNameValidator =
  (documents: Array<GuidanceDocumentDTO>, currentDocumentId?: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors => {
    if (
      !isNil(control.value) &&
      (documents ?? []).filter(
        (document) => document.id !== currentDocumentId && document.title.toLowerCase() === control.value.toLowerCase(),
      ).length > 0
    ) {
      return { name: 'The file name you entered is already in use. Enter a unique file name for this section' };
    }
    return null;
  };

const uploadFileAsyncValidator = (
  sectionId: GuidanceDocumentDTO['guidanceSectionId'],
  fileService: FileUploadService,
  guidanceDocumentsService: GuidanceDocumentsService,
) => fileService.upload((file) => guidanceDocumentsService.uploadGuidanceFile(sectionId, file, 'events', true));

export const manageDocumentsFormProvider: Provider = {
  provide: MANAGE_GUIDANCE_FORM,
  deps: [FormBuilder, GuidanceStore, FileUploadService, GuidanceDocumentsService],
  useFactory: (
    formBuilder: FormBuilder,
    store: GuidanceStore,
    fileUploadService: FileUploadService,
    guidanceDocumentsService: GuidanceDocumentsService,
  ): ManageDocumentsFormGroupModel => {
    const manageGuidance = store.select(guidanceQuery.selectManageGuidance)();
    const section = store.select(guidanceQuery.selectGuidanceSectionById(manageGuidance.sectionId))();

    const document = (manageGuidance?.object ??
      section.guidanceDocuments?.find(
        (document) => document.id === manageGuidance.documentId,
      )) as ManageGuidanceDocumentDTO;

    return formBuilder.group({
      sectionId: formBuilder.control<ManageGuidanceDocumentDTO['sectionId'] | null>(section?.id ?? null),
      title: formBuilder.control<ManageGuidanceDocumentDTO['title'] | null>(document?.title, {
        validators: [
          GovukValidators.required('Enter the file name'),
          GovukValidators.maxLength(255, 'File name should not be more than 255 characters'),
          uniqueDocumentNameValidator(section?.guidanceDocuments, manageGuidance?.documentId),
        ],
        updateOn: 'change',
      }),
      file: formBuilder.control<ManageGuidanceDocumentDTO['file'] | null>(
        document?.file || (document as any)?.fileNameAndUuid
          ? {
              uuid: document?.file?.uuid ?? (document as any)?.fileNameAndUuid?.uuid,
              file: {
                name: document?.file?.file?.name ?? (document as any)?.fileNameAndUuid?.fileName,
              },
            }
          : null,
        {
          validators: createCommonFileValidators(true),
          asyncValidators: [uploadFileAsyncValidator(section.id, fileUploadService, guidanceDocumentsService)],
          updateOn: 'change',
        },
      ),
      displayOrderNo: formBuilder.control<ManageGuidanceDocumentDTO['displayOrderNo'] | null>(document?.displayOrderNo),
    });
  },
};
