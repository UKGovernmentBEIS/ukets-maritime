import { Component, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EMPTY, map, take } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { FeedbackBannerComponent, FeedbackBannerStore, PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { catchBadRequest, ErrorCodes as BusinessErrorCode } from '@netz/common/error';
import { GovukDatePipe } from '@netz/common/pipes';
import { PendingRequestService } from '@netz/common/services';
import {
  ButtonDirective,
  GovukTableColumn,
  GovukValidators,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { ExtendedMiReportResult } from '@mi-reports/core/mi-interfaces';
import { manipulateResultsAndExportToExcel } from '@mi-reports/core/mi-report';
import { CustomReportsPermissionsService } from '@mi-reports/custom-reports/custom-reports-permissions.service';
import { ScrollablePaneDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-custom-reports-preview',
  imports: [
    PageHeadingComponent,
    ButtonDirective,
    RouterLink,
    FeedbackBannerComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    GovukDatePipe,
    ReactiveFormsModule,
    TextareaComponent,
    TableComponent,
    PendingButtonDirective,
    ScrollablePaneDirective,
  ],
  templateUrl: './custom-reports-preview.component.html',
})
export class CustomReportsPreviewComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly service = inject(MiReportsUserDefinedService);
  private readonly pendingRequest = inject(PendingRequestService);
  private readonly feedbackBannerStore = inject(FeedbackBannerStore);
  private readonly customReportsPermissionsService = inject(CustomReportsPermissionsService);

  protected readonly previewData = signal<Array<unknown>>(undefined);
  protected readonly previewColumns = signal<Array<GovukTableColumn>>([]);
  protected readonly canManageReport = toSignal(this.customReportsPermissionsService.canManageCustomReports(), {
    initialValue: false,
  });
  protected readonly data = toSignal(this.activatedRoute.data.pipe(map((data) => data?.customReport)));
  protected readonly formGroup = new UntypedFormGroup({
    sqlQuery: new FormControl(null, {
      validators: [GovukValidators.required('Query must not be empty')],
    }),
  });

  protected readonly favourite = signal(this.data()?.favourite);
  protected readonly queryCtrl = this.formGroup.get('sqlQuery');
  public readonly id = input();

  constructor() {
    effect(() => {
      const { queryDefinition } = this.data() ?? {};

      this.formGroup.patchValue({
        sqlQuery: queryDefinition,
      });
    });
  }

  protected onPreview() {
    this.previewData.update(() => undefined);

    const sqlQuery = this.queryCtrl.value;
    if (!sqlQuery?.trim()?.length) {
      return;
    }

    this.service
      .previewCustomReport({
        sqlQuery,
      })
      .pipe(take(1))
      .subscribe({
        next: ({ columnNames, results }) => {
          this.queryCtrl.setErrors({
            previewError: null,
          });

          this.previewColumns.update(() =>
            columnNames.map((col) => ({
              field: col,
              header: col,
            })),
          );
          this.previewData.update(() => results);
        },
        error: () => {
          this.queryCtrl.setErrors({
            previewError: 'Custom query could not be executed',
          });
        },
        complete: () => {
          this.queryCtrl.updateValueAndValidity();
        },
      });
  }

  protected onSubmit() {
    if (this.formGroup.invalid) {
      this.queryCtrl.setErrors({
        previewError: 'Custom query could not be executed',
      });
      this.queryCtrl.updateValueAndValidity();
      return;
    }

    this.service
      .generateCustomReport({
        sqlQuery: this.queryCtrl.value,
      })
      .pipe(
        this.pendingRequest.trackRequest(),
        catchBadRequest(BusinessErrorCode.REPORT1001, (res) => {
          this.formGroup.setErrors({ invalid: res.error.message });
          this.feedbackBannerStore.setInvalidForm(this.formGroup);
          return EMPTY;
        }),
      )
      .pipe(
        map((results: ExtendedMiReportResult) => {
          manipulateResultsAndExportToExcel(results, this.exportFileName());
        }),
      )
      .subscribe({
        next: () => {
          this.formGroup.setErrors(null);
          this.feedbackBannerStore.reset();
        },
        error: (err) => {
          this.formGroup.setErrors({ invalid: err.message });
          this.feedbackBannerStore.setInvalidFormLive(this.formGroup);
        },
      });
  }

  protected toggleFavourites(event: MouseEvent, favourite: boolean) {
    event.stopPropagation();
    event.preventDefault();

    const id = Number(this.id());

    (favourite
      ? this.service.addMiReportUserDefinedAsFavourite(id)
      : this.service.removeMiReportUserDefinedFromFavourites(id)
    )
      .pipe(take(1))
      .subscribe(() => {
        this.favourite.update(() => favourite);
      });
  }

  private exportFileName(): string {
    const reportName: string = this.data()?.reportName?.trim();

    return reportName ? reportName.split(/\s+/).join('_') : 'Custom sql report';
  }
}
