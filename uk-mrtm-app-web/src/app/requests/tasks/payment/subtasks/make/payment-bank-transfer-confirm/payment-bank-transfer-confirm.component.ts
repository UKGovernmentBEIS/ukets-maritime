import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { MakePaymentWizardSteps } from '@requests/tasks/payment/subtasks/make';

@Component({
  selector: 'mrtm-payment-bank-transfer-confirm',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    RouterLink,
    ButtonDirective,
    LinkDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './payment-bank-transfer-confirm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentBankTransferConfirmComponent {
  private readonly service = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public onSubmit(): void {
    this.service
      .submit()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['../../', MakePaymentWizardSteps.CONFIRMATION], { relativeTo: this.route });
      });
  }
}
