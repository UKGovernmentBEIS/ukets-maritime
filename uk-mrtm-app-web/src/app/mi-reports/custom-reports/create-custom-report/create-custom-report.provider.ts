import { effect, Provider, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { map, take } from 'rxjs';

import { MiReportsUserDefinedService, MiReportUserDefinedDTO } from '@mrtm/api';

import { GovukValidators } from '@netz/govuk-components';

import { MI_CUSTOM_REPORTS_FORM } from '@mi-reports/custom-reports';
import { isNil } from '@shared/utils';

export type CustomReportFormGroupModel = Record<
  keyof Omit<MiReportUserDefinedDTO, 'lastUpdatedOn' | 'categories'> & { reason?: string; categories?: Array<any> },
  AbstractControl
>;

const uniqueReportNameValidator =
  (reportNames: Signal<Array<string>>): ValidatorFn =>
  (control: AbstractControl): ValidationErrors => {
    if (
      !isNil(control.value) &&
      reportNames().filter((reportName) => reportName.toLowerCase() === control.value.toLowerCase()).length > 0
    ) {
      return { reportName: 'The report name already exists. Enter a different report name.' };
    }
    return null;
  };

export const provideCustomReportFormModel: Provider = {
  provide: MI_CUSTOM_REPORTS_FORM,
  deps: [FormBuilder, ActivatedRoute, MiReportsUserDefinedService],
  useFactory: (
    formBuilder: FormBuilder,
    activatedRoute: ActivatedRoute,
    service: MiReportsUserDefinedService,
  ): FormGroup<CustomReportFormGroupModel> => {
    const id = activatedRoute.snapshot.params['id'];

    const definedReports = toSignal(
      service.getAllMiReportsUserDefined(0, 1000, {}).pipe(
        take(1),
        map((res) => res.queries.filter((x) => x.id !== Number(id)).map((item) => item.reportName)),
      ),
      { initialValue: [] as Array<string> },
    );

    const currentReport: Partial<MiReportUserDefinedDTO> = activatedRoute.snapshot.data?.customReport ?? {};

    const form = formBuilder.group<CustomReportFormGroupModel>({
      reportName: formBuilder.control<MiReportUserDefinedDTO['reportName']>(currentReport?.reportName ?? null, {
        validators: [GovukValidators.required('Enter report name'), uniqueReportNameValidator(definedReports)],
      }),
      categories: formBuilder.control<Array<any>>(
        currentReport?.categories ? currentReport?.categories.map((x) => `${x.id}`) : null,
        {
          validators: [GovukValidators.required('Select at least one category')],
        },
      ),
      description: formBuilder.control<MiReportUserDefinedDTO['description']>(currentReport?.description ?? null, {
        validators: [
          GovukValidators.required('Enter description'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      }),
      favourite: formBuilder.control<MiReportUserDefinedDTO['favourite']>(currentReport?.favourite ?? null),
      queryDefinition: formBuilder.control<MiReportUserDefinedDTO['queryDefinition']>(
        currentReport?.queryDefinition ?? null,
        {
          validators: [
            GovukValidators.required('Query must not be empty'),
            GovukValidators.maxLength(50000, 'Enter up to 50000 characters'),
          ],
        },
      ),
      reason: formBuilder.control<string>(null, {
        validators: [
          GovukValidators.required('Enter reason for change'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      }),
    });

    effect(() => {
      definedReports();
      form.get('reportName').updateValueAndValidity({ emitEvent: false });
    });

    return form;
  },
};
