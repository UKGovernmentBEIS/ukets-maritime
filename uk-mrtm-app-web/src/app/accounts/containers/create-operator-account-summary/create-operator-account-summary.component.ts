import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Observable, takeUntil, tap } from 'rxjs';

import { MrtmAccountViewDTO } from '@mrtm/api';

import { PendingButtonDirective } from '@netz/common/directives';
import { DestroySubject } from '@netz/common/services';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { OperatorAccountSummaryInfoComponent } from '@accounts/components';
import { OperatorAccountsStore, selectNewAccount } from '@accounts/store';

@Component({
  selector: 'mrtm-create-operator-account-summary',
  imports: [
    RouterLink,
    OperatorAccountSummaryInfoComponent,
    PendingButtonDirective,
    AsyncPipe,
    ButtonDirective,
    LinkDirective,
  ],
  standalone: true,
  templateUrl: './create-operator-account-summary.component.html',
  providers: [DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOperatorAccountSummaryComponent {
  private readonly store: OperatorAccountsStore = inject(OperatorAccountsStore);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly destroySubject: DestroySubject = inject(DestroySubject);

  readonly info$: Observable<MrtmAccountViewDTO> = this.store.pipe(selectNewAccount, takeUntil(this.destroySubject));

  handleSubmit(): void {
    this.store
      .createAccount()
      .pipe(
        tap(() => {
          this.store.setIsSubmitted(true);
          this.router.navigate(['../', 'success'], { relativeTo: this.activeRoute });
        }),
        takeUntil(this.destroySubject),
      )
      .subscribe();
  }
}
