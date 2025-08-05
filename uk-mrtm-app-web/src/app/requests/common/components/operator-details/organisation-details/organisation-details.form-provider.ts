import { inject, Provider } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import {
  IndividualOrganisation,
  LimitedCompanyOrganisation,
  OrganisationStructure,
  PartnershipOrganisation,
} from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { getLocationStateFormGroup } from '@shared/components';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';
import { legalStatusTypeToDisplayTextTransformer } from '@shared/utils';

export const organisationDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService) => {
    const commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
    const operatorDetails = store.select(commonSubtaskStepsQuery.selectOperatorDetails)();
    const attachments = store.select(commonSubtaskStepsQuery.selectAttachments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

    const formGroup: UntypedFormGroup = formBuilder.group({
      legalStatusTypeText: formBuilder.control<string | null>({
        value: legalStatusTypeToDisplayTextTransformer(operatorDetails?.organisationStructure?.legalStatusType ?? null),
        disabled: true,
      }),
      legalStatusType: formBuilder.control<OrganisationStructure['legalStatusType'] | null>({
        value: operatorDetails?.organisationStructure?.legalStatusType ?? null,
        disabled: true,
      }),
      sameAsContactAddress: formBuilder.control<[boolean]>([
        operatorDetails?.organisationStructure?.sameAsContactAddress,
      ]),
      registeredAddress: formBuilder.group({
        ...getLocationStateFormGroup(operatorDetails?.organisationStructure?.registeredAddress),
      }),
    });

    switch (operatorDetails?.organisationStructure?.legalStatusType) {
      case 'LIMITED_COMPANY':
        formGroup.addControl(
          'registrationNumber',
          formBuilder.control<string | null>(
            (operatorDetails?.organisationStructure as LimitedCompanyOrganisation).registrationNumber,
            {
              validators: [
                GovukValidators.required('Enter a company registration number'),
                GovukValidators.maxLength(50, 'Company registration number should not be more than 50 characters'),
              ],
            },
          ),
        );
        formGroup.addControl(
          'evidenceFiles',
          fileService.buildFormControl(
            requestTaskId,
            (operatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles ?? [],
            attachments,
            taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
            false,
            !isEditable,
          ),
        );
        break;
      case 'INDIVIDUAL':
        formGroup.addControl(
          'fullName',
          formBuilder.control<string | null>(
            (operatorDetails?.organisationStructure as IndividualOrganisation).fullName,
            {
              validators: [
                GovukValidators.required('Enter a company full name'),
                GovukValidators.maxLength(250, 'Company full name should not be more than 250 characters'),
              ],
            },
          ),
        );
        break;
      case 'PARTNERSHIP':
        formGroup.addControl(
          'partnershipName',
          formBuilder.control<string | null>(
            (operatorDetails?.organisationStructure as PartnershipOrganisation)?.partnershipName,
            { validators: [GovukValidators.maxLength(250, 'Partnership name should not be more than 250 characters')] },
          ),
        );
        formGroup.addControl(
          'partners',
          formBuilder.array(
            (operatorDetails?.organisationStructure as PartnershipOrganisation)?.partners?.length > 0
              ? (operatorDetails?.organisationStructure as PartnershipOrganisation)?.partners?.map(
                  addPartnerFormControl,
                )
              : [addPartnerFormControl()],
            {},
          ),
        );
        break;
    }

    return formGroup;
  },
};

export const addPartnerFormControl = (value?: string): UntypedFormControl =>
  new UntypedFormControl(value, {
    validators: [
      GovukValidators.required('Enter the name of the partner organisation'),
      GovukValidators.maxLength(250, 'Partner organisation name should not be more than 250 characters'),
    ],
  });
