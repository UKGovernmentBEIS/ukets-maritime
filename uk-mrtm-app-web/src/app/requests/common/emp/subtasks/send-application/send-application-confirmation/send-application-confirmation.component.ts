import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective } from '@netz/govuk-components';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';

@Component({
  selector: 'mrtm-send-application-confirmation',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent, PendingButtonDirective, ReturnToTaskOrActionPageComponent],
  templateUrl: './send-application-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendApplicationConfirmationComponent {
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  onSubmit() {
    this.service.submit().subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.route, skipLocationChange: true });
    });
  }
}
