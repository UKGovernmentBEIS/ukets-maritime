import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';

@Component({
  selector: 'mrtm-aer-fetch-from-voyages-and-ports',
  standalone: true,
  imports: [
    PageHeadingComponent,
    WarningTextComponent,
    ButtonDirective,
    RouterLink,
    LinkDirective,
    PendingButtonDirective,
  ],
  templateUrl: './aer-fetch-from-voyages-and-ports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerFetchFromVoyagesAndPortsComponent {
  public readonly wizardMap = aerAggregatedDataSubtasksListMap;
  public readonly wizardStep = AerAggregatedDataWizardStep;
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public onSubmit(): void {
    this.service
      .saveSubtask(
        AER_AGGREGATED_DATA_SUB_TASK,
        this.wizardStep.FETCH_FROM_VOYAGES_AND_PORTS,
        this.activatedRoute,
        null,
      )
      .pipe(take(1))
      .subscribe();
  }
}
