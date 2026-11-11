import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthStore, selectUserProfile } from '@netz/common/auth';
import { LinkDirective, PhaseBannerComponent } from '@netz/govuk-components';

import { ServiceFeedbackLinkService } from '@shared/services';

@Component({
  selector: 'mrtm-phase-bar',
  imports: [PhaseBannerComponent, LinkDirective, RouterLink],
  standalone: true,
  template: `
    <govuk-phase-banner borderTop phase="Beta">
      @if (userProfile(); as user) {
        @if (isServiceFeedbackLinkVisible()) {
          This is a new service – your
          <a govukLink routerLink="feedback">feedback</a>
          will help us to improve it.
        }

        <span class="logged-in-user float-right">
          You are signed in as
          <span class="govuk-!-font-weight-bold">{{ user.firstName }} {{ user.lastName }}</span>
        </span>
      }
    </govuk-phase-banner>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseBarComponent {
  private readonly authStore = inject(AuthStore);

  readonly isServiceFeedbackLinkVisible = inject(ServiceFeedbackLinkService).isVisible;
  userProfile = this.authStore.select(selectUserProfile);
}
