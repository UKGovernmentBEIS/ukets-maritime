import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';

import { isNil } from 'lodash-es';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { EmpBatchVariationDetailsDTO } from '@shared/types';

@Component({
  selector: 'mrtm-emp-batch-reissue-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryDownloadFilesComponent,
    GovukDatePipe,
  ],
  standalone: true,
  templateUrl: './emp-batch-reissue-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpBatchReissueSummaryTemplateComponent {
  protected readonly isNil = isNil;

  public readonly actionType = input.required<string>();
  public readonly data = input.required<EmpBatchVariationDetailsDTO>();

  public readonly showEmittersSummary: Signal<boolean> = computed(() =>
    ['EMP_BATCH_REISSUE_COMPLETED', 'EMP_BATCH_REISSUE_SUBMITTED'].includes(this.actionType()),
  );
  public readonly variationReportInProgress = computed(() => this.actionType() === 'EMP_BATCH_REISSUE_SUBMITTED');
}
