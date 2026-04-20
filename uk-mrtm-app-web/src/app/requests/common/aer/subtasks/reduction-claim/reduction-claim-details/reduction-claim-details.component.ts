import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { AerSmf } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_REDUCTION_CLAIM_SUB_TASK,
  ReductionClaimWizardStep,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.map';
import { ReductionClaimDetailsSummaryTemplateComponent } from '@shared/components';
import { ReductionClaimDetailsListItemDto, SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-reduction-claim-details',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReductionClaimDetailsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    RouterLink,
  ],
  templateUrl: './reduction-claim-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimDetailsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly isEditable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly wizardMap: SubTaskListMap<AerSmf> = reductionClaimMap;
  public readonly wizardStep: typeof ReductionClaimWizardStep = ReductionClaimWizardStep;
  public readonly data: Signal<Array<ReductionClaimDetailsListItemDto>> = this.store.select(
    aerCommonQuery.selectReductionClaimDetailsListItems,
  );

  public onChange(item: ReductionClaimDetailsListItemDto): void {
    this.router.navigate([item.uniqueIdentifier], {
      relativeTo: this.activatedRoute,
      queryParams: { change: true },
    });
  }

  public onDelete(item: ReductionClaimDetailsListItemDto): void {
    this.service
      .saveSubtask(AER_REDUCTION_CLAIM_SUB_TASK, this.wizardStep.DELETE_FUEL_PURCHASE, this.activatedRoute, item)
      .pipe(take(1))
      .subscribe();
  }
}
