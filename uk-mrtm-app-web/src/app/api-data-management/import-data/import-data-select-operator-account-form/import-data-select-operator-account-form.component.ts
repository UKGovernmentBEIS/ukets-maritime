import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { map, switchMap, tap } from 'rxjs';

import { ThirdPartyDataManagementAPIService } from '@mrtm/api';

import { LinkDirective } from '@netz/govuk-components';

import { IMPORT_DATA_WIZARD_STEP } from '@api-data-management/api-data-management.constants';
import { IMPORT_DATA_FORM_PROVIDER } from '@api-data-management/import-data';
import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { SELECTED_ACCOUNTS_COLUMNS } from '@api-data-management/import-data/import-data-select-operator-account-form/import-data-select-operator-account-form.constants';
import { provideImportDataSelectOperatorAccountFormProvider } from '@api-data-management/import-data/import-data-select-operator-account-form/import-data-select-operator-account-form.provider';
import { MultiSelectTableComponent, WizardStepComponent } from '@shared/components';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-import-data-select-operator-account',
  imports: [WizardStepComponent, RouterLink, LinkDirective, MultiSelectTableComponent],
  templateUrl: './import-data-select-operator-account-form.component.html',
  providers: [provideImportDataSelectOperatorAccountFormProvider],
})
export class ImportDataSelectOperatorAccountFormComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ImportDataStore);
  private readonly service = inject(ThirdPartyDataManagementAPIService);
  protected readonly form = inject(IMPORT_DATA_FORM_PROVIDER);
  protected readonly page = signal<number>(0);
  protected readonly pageSize = signal(20);
  protected readonly totalItems = signal(0);
  protected readonly data = toSignal(
    toObservable(
      computed(() => ({
        page: this.page(),
        size: 10000,
      })),
    ).pipe(
      switchMap(({ page, size }) =>
        this.service.findDataAvailableToImport(page, size, {
          requestType: this.store.state.requestType,
          year: this.store.state.year,
        }),
      ),
      tap((res) => {
        this.totalItems.set(res.totalItems);
      }),
      map((res) =>
        (res?.items ?? []).map((item) => ({
          ...item,
          isSelected: isNil(this.store.state.items) ? true : !!this.store.state.items.find((x) => x === item.id),
        })),
      ),
      tap((res) => {
        this.updateForm(res.filter((x) => x.isSelected).map((x) => x.id));
      }),
    ),
    { initialValue: [] },
  );

  protected readonly columns = SELECTED_ACCOUNTS_COLUMNS;

  public onAccountsSelectionChanged(): void {
    this.updateForm(
      this.data()
        .filter((x) => x.isSelected)
        .map((x) => x.id),
    );
  }

  private updateForm(items: number[]): void {
    this.form.patchValue({
      items,
    });
  }

  protected onSubmit(): void {
    this.store.setState({
      ...this.store.state,
      items: this.form.value.items,
      rawItems: this.data().filter((x) => x.isSelected),
    });

    this.router.navigate([IMPORT_DATA_WIZARD_STEP.SUMMARY], { relativeTo: this.route });
  }
}
