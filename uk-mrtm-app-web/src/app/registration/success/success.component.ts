import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonDirective, PanelComponent } from '@netz/govuk-components';

import { AuthService } from '@core/services/auth.service';
import { UserRegistrationStore } from '@registration/store/user-registration.store';

@Component({
  selector: 'mrtm-success',
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel title="You've successfully created a user account"></govuk-panel>
        <p class="govuk-body">We have sent an email with your user account details.</p>
        <p class="govuk-body">
          When you sign in to the UK ETS reporting service for the first time, you'll be asked to set up two-factor
          authentication.
        </p>
        <h3 class="govuk-heading-m">What happens next</h3>
        <p class="govuk-body">You can sign in to the UK ETS reporting service.</p>
        <button type="button" (click)="authService.login({})" govukButton>Sign in</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PanelComponent, ButtonDirective],
})
export class SuccessComponent {
  readonly authService = inject(AuthService);
  private readonly store = inject(UserRegistrationStore);

  constructor() {
    const store = this.store;

    store.reset();
  }
}
