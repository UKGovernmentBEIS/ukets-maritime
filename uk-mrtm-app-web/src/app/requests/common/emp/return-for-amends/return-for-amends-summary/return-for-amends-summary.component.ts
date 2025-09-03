import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { ButtonDirective } from '@netz/govuk-components';

import {
  AMENDS_NEEDED_GROUPS,
  RETURN_FOR_AMENDS_SERVICE,
} from '@requests/common/emp/return-for-amends/return-for-amends.providers';
import { IReturnForAmendsService } from '@requests/common/emp/return-for-amends/return-for-amends.types';
import { ReviewReturnForAmendsSubtaskSummaryTemplateComponent } from '@shared/components';
import { empSubtaskToTitle } from '@shared/constants';

@Component({
  selector: 'mrtm-operator-amends',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReviewReturnForAmendsSubtaskSummaryTemplateComponent,
    ButtonDirective,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './return-for-amends-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnForAmendsSummaryComponent {
  private readonly service: IReturnForAmendsService<unknown> =
    inject<IReturnForAmendsService<unknown>>(RETURN_FOR_AMENDS_SERVICE);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly decisionForAmends = inject(AMENDS_NEEDED_GROUPS);
  public readonly subtaskTitleMap: Record<keyof EmissionsMonitoringPlan, string> = empSubtaskToTitle;

  public onSubmit() {
    this.service.sendForAmends().subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.activatedRoute });
    });
  }
}
