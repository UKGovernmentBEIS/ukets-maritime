import { Component, computed, inject, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { ThirdPartyDataManagementAPIService } from '@mrtm/api';

import { FeedbackBannerComponent, FeedbackBannerStore, PageHeadingComponent } from '@netz/common/components';
import {
  ButtonDirective,
  LinkDirective,
  PaginationComponent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
  WarningTextComponent,
} from '@netz/govuk-components';

import { IMPORT_DATA_WIZARD_STEP } from '@api-data-management/api-data-management.constants';
import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { SELECTED_ACCOUNTS_SUMMARY_COLUMNS } from '@api-data-management/import-data/import-data-summary/import-data-summary.constants';
import { ApiDataManagementTaskTypeToTextPipe } from '@api-data-management/pipes';

@Component({
  selector: 'mrtm-import-data-summary',
  imports: [
    PageHeadingComponent,
    WarningTextComponent,
    ButtonDirective,
    LinkDirective,
    PaginationComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    TableComponent,
    ApiDataManagementTaskTypeToTextPipe,
    RouterLink,
    FeedbackBannerComponent,
  ],
  templateUrl: './import-data-summary.component.html',
})
export class ImportDataSummaryComponent {
  private readonly store = inject(ImportDataStore);
  private readonly feedbackBannerStore = inject(FeedbackBannerStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly service = inject(ThirdPartyDataManagementAPIService);
  private readonly form = new UntypedFormGroup({});
  protected readonly data = signal(this.store.state);
  protected readonly wizardStep = IMPORT_DATA_WIZARD_STEP;
  protected readonly columns = SELECTED_ACCOUNTS_SUMMARY_COLUMNS;
  protected readonly page = signal(1);
  protected readonly pageSize = signal(20);

  protected readonly rows = computed(() => {
    const page = this.page();
    const pageSize = this.pageSize();

    return this.data().rawItems?.slice((page - 1) * pageSize, page * pageSize);
  });

  protected onPageChange(page: number) {
    this.page.set(page);
  }

  public onSubmit(): void {
    const { items, year, requestType } = this.store.state;
    this.form.reset();
    this.service
      .initiateImport({
        items,
        year,
        requestType,
      })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate([this.wizardStep.SUCCESS], { relativeTo: this.activatedRoute });
        },
        error: () => {
          this.form.setErrors({
            requestError: 'The data import could not be started - try again.',
          });
          this.feedbackBannerStore.setInvalidForm(this.form);
        },
      });
  }
}
