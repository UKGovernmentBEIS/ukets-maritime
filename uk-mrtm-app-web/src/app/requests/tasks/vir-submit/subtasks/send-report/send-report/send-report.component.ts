import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, WarningTextComponent } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';

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
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  onSubmit() {
    this.service.submit().subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.route, skipLocationChange: true });
    });
  }
}
