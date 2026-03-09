import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-submit-confirmation',
  standalone: true,
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, ButtonDirective, PendingButtonDirective],
  templateUrl: './complete-review-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteReviewConfirmationComponent {
  private readonly service = inject(TaskService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public onSubmit(): void {
    this.service
      .submit()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['./', 'success'], {
          relativeTo: this.activatedRoute,
          skipLocationChange: true,
        });
      });
  }
}
