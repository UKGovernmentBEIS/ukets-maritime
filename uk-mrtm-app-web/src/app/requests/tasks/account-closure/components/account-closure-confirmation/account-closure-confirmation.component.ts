import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { ButtonDirective } from '@netz/govuk-components';

import { AccountClosureStateService } from '@requests/tasks/account-closure/services';

@Component({
  selector: 'mrtm-account-closure-confirmation',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent, PendingButtonDirective],
  templateUrl: './account-closure-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureConfirmationComponent {
  private readonly accountClosureStateService = inject(AccountClosureStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  onSubmit() {
    this.accountClosureStateService
      .submitAccountClosure()
      .subscribe(() => this.router.navigate(['../success'], { relativeTo: this.route }));
  }
}
