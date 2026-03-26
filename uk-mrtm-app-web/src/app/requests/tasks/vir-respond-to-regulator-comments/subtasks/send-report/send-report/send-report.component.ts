import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective, WarningTextComponent } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { VirRespondToRegulatorService } from '@requests/tasks/vir-respond-to-regulator-comments/services';

@Component({
  selector: 'mrtm-send-report',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    WarningTextComponent,
  ],
  standalone: true,
  templateUrl: './send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportComponent {
  private readonly service: VirRespondToRegulatorService = inject(
    TaskService<AerSubmitTaskPayload>,
  ) as VirRespondToRegulatorService;
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly key: InputSignal<string> = input<string>();

  onSubmit() {
    this.service.submitOperatorImprovement(this.key()).subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.activatedRoute, skipLocationChange: true });
    });
  }
}
