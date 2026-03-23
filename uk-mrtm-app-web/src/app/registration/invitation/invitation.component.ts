import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map } from 'rxjs';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { UserTypePipeWithArticle } from '@accounts/pipes/user-type-with-article.pipe';
import { UserRegistrationStore } from '@registration/store/user-registration.store';

@Component({
  selector: 'mrtm-invitation',
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel
          title="You have been added as {{
            (operatorInvitationResultData$ | async)?.roleCode | userTypeWithArticle
          }} to the account of {{ (operatorInvitationResultData$ | async)?.accountName }}"></govuk-panel>

        <h2 class="govuk-heading-m">What happens next</h2>
        <p class="govuk-body">
          All system alerts, notices and official communications will be sent to your registered email.
        </p>

        <p class="govuk-body">
          <a routerLink="/dashboard" govukLink>Go to my dashboard</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink, AsyncPipe, UserTypePipeWithArticle],
})
export class InvitationComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(UserRegistrationStore);

  operatorInvitationResultData$ = this.activatedRoute.data.pipe(map((data) => data?.operatorInvitationResultData));

  constructor() {
    const store = this.store;

    store.reset();
  }
}
