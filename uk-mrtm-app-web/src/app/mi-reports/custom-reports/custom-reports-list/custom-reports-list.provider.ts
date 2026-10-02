import { Provider } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MiReportUserDefinedSearchCriteriaDTO } from '@mrtm/api';

import { MI_CUSTOM_REPORTS_FORM } from '@mi-reports/custom-reports/custom-reports.constants';

export type CustomReportsListFiltersFormModelType = Pick<
  MiReportUserDefinedSearchCriteriaDTO,
  'term' | 'categoryId' | 'favourites'
>;

export const provideCustomReportsListFiltersForm: Provider = {
  provide: MI_CUSTOM_REPORTS_FORM,
  deps: [FormBuilder, ActivatedRoute],
  useFactory: (
    fb: FormBuilder,
    activatedRoute: ActivatedRoute,
  ): FormGroup<Record<keyof CustomReportsListFiltersFormModelType, AbstractControl>> => {
    const params = toSignal(activatedRoute.queryParams)();

    return fb.group<Record<keyof CustomReportsListFiltersFormModelType, AbstractControl>>({
      categoryId: fb.control<CustomReportsListFiltersFormModelType['categoryId'] | null>(
        params['categoryId'] ? Number(params['categoryId']) : null,
      ),
      term: fb.control<CustomReportsListFiltersFormModelType['term'] | null>(params['term'] ?? null),
      favourites: fb.control<Array<CustomReportsListFiltersFormModelType['favourites']> | null>([
        params['favourites'] ? Boolean(params['favourites']) : null,
      ]),
    });
  },
};
