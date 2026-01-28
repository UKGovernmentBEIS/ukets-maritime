import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

import { PendingButtonDirective } from '@netz/common/directives';
import { PendingRequestService } from '@netz/common/services';
import { ButtonDirective, GovukTableColumn, PaginationComponent, TableComponent } from '@netz/govuk-components';

import { ExtendedMiReportResult } from '@mi-reports/core/mi-interfaces';
import { createTablePage, miReportTypeDescriptionMap, pageSize } from '@mi-reports/core/mi-report';
import { MI_REPORT_FORM_COMPONENT, MI_REPORT_FORM_GROUP } from '@mi-reports/core/mi-report.providers';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MI_REPORT_USE_CASE_SERVICE, MiReportUseCaseService } from '@mi-reports/use-cases/common';
import { WizardStepComponent } from '@shared/components';
import { ScrollablePaneDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-report-preview',
  standalone: true,
  imports: [
    PendingButtonDirective,
    ButtonDirective,
    TableComponent,
    PaginationComponent,
    WizardStepComponent,
    ReactiveFormsModule,
    NgComponentOutlet,
    ScrollablePaneDirective,
  ],
  templateUrl: './report-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPreviewComponent {
  private readonly useCaseService = inject<MiReportUseCaseService>(MI_REPORT_USE_CASE_SERVICE);
  private readonly destroyRef = inject(DestroyRef);

  private readonly pendingRequestsService: PendingRequestService = inject(PendingRequestService);
  private readonly reportFormGroup = inject(MI_REPORT_FORM_GROUP, { optional: true });
  public readonly reportFormComponent = inject(MI_REPORT_FORM_COMPONENT, { optional: true });

  public readonly reportType: MiReportType = this.useCaseService.reportType;
  public readonly pageSize: number = pageSize;
  public readonly title = miReportTypeDescriptionMap[this.reportType];
  public readonly currentPage: WritableSignal<number> = signal(1);
  public readonly reportData: WritableSignal<ExtendedMiReportResult> = signal<ExtendedMiReportResult>(undefined);
  public readonly tableColumns: Signal<Array<GovukTableColumn>> = this.useCaseService.tableColumns;

  public readonly tableData: Signal<Array<any>> = computed(() =>
    createTablePage(this.currentPage(), this.pageSize, this.reportData()?.results)?.map((item) => {
      const result: Record<string, unknown> = {};
      for (const col of this.tableColumns()) {
        const fieldName: string = col?.field as string;
        const columnMapper = this.useCaseService.columnValueMapper?.[fieldName];

        result[fieldName] = columnMapper ? columnMapper(item?.[fieldName]) : item?.[fieldName];
      }

      return result;
    }),
  );

  formGroup: FormGroup = this.reportFormGroup ? this.reportFormGroup() : new UntypedFormGroup({});

  generateReport(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.useCaseService
      .getReportData(this.formGroup.value)
      .pipe(this.pendingRequestsService.trackRequest(), takeUntilDestroyed(this.destroyRef))
      .subscribe((res: ExtendedMiReportResult) => this.reportData.set(res));
  }

  exportToExcel(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.useCaseService
      .exportToExcel(this.formGroup.value)
      .pipe(this.pendingRequestsService.trackRequest(), takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
