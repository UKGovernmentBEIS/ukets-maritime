import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { doeCommonQuery, doeTotalMaritimeEmissionsMap, maritimeEmissionsMap } from '@requests/common/doe';
import { MaritimeEmissionsWizardStep } from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { DoeMaritimeEmissionsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-maritime-emissions-summary',
  imports: [PageHeadingComponent, DoeMaritimeEmissionsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  standalone: true,
  templateUrl: './maritime-emissions-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaritimeEmissionsSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  public readonly wizardStep = MaritimeEmissionsWizardStep;
  public readonly maritimeEmissionsMap = maritimeEmissionsMap;
  public readonly doeTotalMaritimeEmissionsMap = doeTotalMaritimeEmissionsMap;
  public readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly maritimeEmissions = this.store.select(doeCommonQuery.selectMaritimeEmissions);
  public readonly files = computed(() => {
    const maritimeEmissions = this.maritimeEmissions();
    return this.store.select(
      doeCommonQuery.selectAttachedFiles(maritimeEmissions?.totalMaritimeEmissions?.supportingDocuments),
    )();
  });
}
