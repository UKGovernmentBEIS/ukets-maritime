import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map, take } from 'rxjs';

import { MiReportsUserDefinedService, MiReportUserDefinedDTO } from '@mrtm/api';

import { FeedbackBannerStore } from '@netz/common/components';
import {
  ButtonDirective,
  GovukTableColumn,
  LinkDirective,
  TableComponent,
  TextareaComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { provideCustomReportFormModel } from '@mi-reports/custom-reports/create-custom-report/create-custom-report.provider';
import { MI_CUSTOM_REPORTS_FORM, MiReportFormMode } from '@mi-reports/custom-reports/custom-reports.constants';
import { MultiSelectComponent, MultiSelectItemComponent, WizardStepComponent } from '@shared/components';
import { ScrollablePaneDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-create-custom-report',
  imports: [
    ButtonDirective,
    WizardStepComponent,
    TextInputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    MultiSelectComponent,
    MultiSelectItemComponent,
    TableComponent,
    LinkDirective,
    ScrollablePaneDirective,
  ],
  templateUrl: './create-custom-report.component.html',
  styleUrl: './create-custom-report.component.scss',
  providers: [provideCustomReportFormModel],
})
export class CreateCustomReportComponent {
  private readonly service = inject(MiReportsUserDefinedService);
  private readonly feedbackBannerStore = inject(FeedbackBannerStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly formGroup = inject(MI_CUSTOM_REPORTS_FORM);
  private readonly routeData = toSignal(this.activatedRoute.data);
  protected readonly previewData = signal<Array<unknown>>(undefined);
  protected readonly previewColumns = signal<Array<GovukTableColumn>>([]);
  private readonly queryCtrl = this.formGroup.get('queryDefinition');

  protected readonly caption = computed(() => {
    const mode = this.routeData()?.formMode as MiReportFormMode;

    return mode === MiReportFormMode.ADD ? 'MI Reports' : this.formGroup.get('reportName').value;
  });

  protected readonly title = computed(() => {
    const mode = this.routeData()?.formMode as MiReportFormMode;

    return mode === MiReportFormMode.ADD ? 'Add a custom report' : 'Edit report';
  });

  protected readonly formMode = computed(() => this.routeData()?.formMode as MiReportFormMode);

  constructor() {
    effect(() => {
      const formMode = this.formMode();
      if (formMode === MiReportFormMode.ADD) {
        this.formGroup.get('reason').disable();
      }
    });
  }

  protected readonly availableCategories = toSignal(
    this.service.getCategories().pipe(
      map((res) =>
        res.map((item) => ({
          text: item.name,
          value: `${item.id}`,
        })),
      ),
    ),
  );
  protected onSubmit(): void {
    const { categories, reason, ...rest } = this.formGroup.value;

    const dto: MiReportUserDefinedDTO = {
      ...rest,
      categories: this.availableCategories()
        .filter((x) => categories.includes(x.value))
        .map((x) => ({
          id: Number(x.value),
          name: x.text,
        })),
    };

    (this.formMode() === MiReportFormMode.ADD
      ? this.service.createMiReportUserDefined(dto)
      : this.service.updateMiReportUserDefined(Number(this.activatedRoute.snapshot.params['id']), {
          reasonForChange: reason,
          userDefinedDTO: dto,
        })
    )
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.feedbackBannerStore.setSuccessMessages(['Report saved']);
          this.router.navigate([this.formMode() === MiReportFormMode.ADD ? '../../' : '../'], {
            relativeTo: this.activatedRoute,
          });
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

  protected onPreviewResults() {
    this.previewData.update(() => undefined);

    const sqlQuery = this.queryCtrl.value;
    if (!sqlQuery?.trim()?.length) {
      return;
    }

    this.queryCtrl.updateValueAndValidity();

    this.service
      .previewCustomReport({
        sqlQuery,
      })
      .pipe(take(1))
      .subscribe({
        next: ({ columnNames, results }) => {
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
}
