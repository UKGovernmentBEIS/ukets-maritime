import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { takeUntil } from 'rxjs';

import { AuthStore, selectUserProfile } from '@netz/common/auth';
import { DestroySubject } from '@netz/common/services';
import { LinkDirective, PhaseBannerComponent } from '@netz/govuk-components';

/* eslint-disable @angular-eslint/use-component-view-encapsulation */
@Component({
  selector: 'mrtm-phase-bar',
  imports: [PhaseBannerComponent, LinkDirective, RouterLink, AsyncPipe],
  standalone: true,
  template: `
    <govuk-phase-banner phase="Beta">
      This is a new service – your
      <a govukLink routerLink="feedback">feedback</a>
      will help us to improve it.
      @if (userProfile$ | async; as user) {
        <span class="logged-in-user float-right">
          You are logged in as:
          <span class="govuk-!-font-weight-bold">{{ user.firstName }} {{ user.lastName }}</span>
        </span>
      }
    </govuk-phase-banner>
  `,
  providers: [DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PhaseBarComponent {
  private readonly authStore = inject(AuthStore);
  private readonly destroy$ = inject(DestroySubject);

  userProfile$ = this.authStore.rxSelect(selectUserProfile).pipe(takeUntil(this.destroy$));
}
