import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-report-confirmation',
  imports: [ButtonDirective, PageHeadingComponent, PendingButtonDirective, ReturnToTaskOrActionPageComponent],
  standalone: true,
  templateUrl: './send-report-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportConfirmationComponent {
  private readonly service = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  onSubmit() {
    this.service.submit().subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.route, skipLocationChange: true });
    });
  }
}
