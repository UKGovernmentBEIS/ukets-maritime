import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { map } from 'rxjs';

import { MiReportsService, RegulatorAuthoritiesService } from '@mrtm/api';

import { getTitleByWorkflowTaskName } from '@mi-reports/mi-report.utils';
import { MultiSelectComponent, MultiSelectItemComponent } from '@shared/components';
import { existingControlContainer } from '@shared/providers';

@Component({
  selector: 'mrtm-regulator-outstanding-request',
  imports: [MultiSelectComponent, ReactiveFormsModule, MultiSelectItemComponent],
  standalone: true,
  templateUrl: './regulator-outstanding-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [existingControlContainer],
})
export class RegulatorOutstandingRequestComponent {
  private readonly regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);
  private readonly miReportService = inject(MiReportsService);

  public readonly regulatorsOptions = toSignal(
    this.regulatorAuthoritiesService.getCaRegulators().pipe(
      map((res) =>
        (res?.caUsers ?? []).map((regulator) => ({
          value: regulator.userId,
          label: `${regulator.firstName} ${regulator.lastName}`,
        })),
      ),
    ),
  );

  public readonly taskTypes = toSignal(
    this.miReportService.getRegulatorRequestTaskTypes().pipe(
      map((taskTypes) =>
        taskTypes.map((taskType) => ({
          value: taskType,
          label: getTitleByWorkflowTaskName(taskType),
        })),
      ),
    ),
  );
}
