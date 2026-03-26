import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { DateInputComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { PaymentService } from '@requests/tasks/payment/services';
import { MarkAsReceivedWizardSteps } from '@requests/tasks/payment/subtasks/mark-as-received';
import { markAsReceivedFormProvider } from '@requests/tasks/payment/subtasks/mark-as-received/mark-as-received-form/mark-as-received-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-mark-as-received-form',
  imports: [WizardStepComponent, DateInputComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './mark-as-received-form.component.html',
  providers: [markAsReceivedFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkAsReceivedFormComponent {
  private readonly service = inject(TaskService) as PaymentService;
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly form = inject(TASK_FORM);

  public onSubmit(): void {
    this.service
      .markAsReceived(this.form.value)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate([MarkAsReceivedWizardSteps.SUCCESS], { relativeTo: this.activatedRoute });
      });
  }
}
