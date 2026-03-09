import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { switchMap, take } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerCommonService } from '@requests/common/aer/services';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions';
import { aerEmissionsMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';

@Component({
  selector: 'mrtm-aer-fetch-ships-from-emp',
  standalone: true,
  imports: [
    PageHeadingComponent,
    WarningTextComponent,
    PendingButtonDirective,
    ButtonDirective,
    RouterLink,
    LinkDirective,
  ],
  templateUrl: './aer-fetch-ships-from-emp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerFetchShipsFromEmpComponent {
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  public readonly wizardSteps = AerEmissionsWizardStep;
  public readonly map = aerEmissionsMap;

  public onFetchFromEMP(): void {
    (this.service as AerCommonService)
      .fetchShipsFromEMP()
      .pipe(
        switchMap(() =>
          this.service.saveSubtask(EMISSIONS_SUB_TASK, AerEmissionsWizardStep.FETCH_FROM_EMP, this.activatedRoute, {}),
        ),
        take(1),
      )
      .subscribe(() => {
        this.router.navigate(['../', AerEmissionsWizardStep.LIST_OF_SHIPS], { relativeTo: this.activatedRoute });
      });
  }
}
