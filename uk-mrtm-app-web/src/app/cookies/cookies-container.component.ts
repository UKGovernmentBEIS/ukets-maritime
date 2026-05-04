import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CookiesPopUpComponent } from '@netz/govuk-components';

import { CookiesService } from '@cookies/cookies.service';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'mrtm-cookies-container',
  imports: [CookiesPopUpComponent, AsyncPipe],
  standalone: true,
  template: `
    <govuk-cookies-pop-up
      cookiesExpirationTime="1"
      [areBrowserCookiesEnabled]="cookiesEnabled"
      [cookiesAccepted]="cookiesAccepted$ | async"
      (cookiesRejectedEmitter)="rejectCookies($event)"
      (cookiesAcceptedEmitter)="acceptCookies($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesContainerComponent {
  private readonly cookiesService = inject(CookiesService);
  private readonly analyticsService = inject(AnalyticsService);
  cookiesEnabled = this.cookiesService.cookiesEnabled();
  cookiesAccepted$ = this.cookiesService.accepted$;

  acceptCookies(expired: string) {
    this.cookiesService.acceptAllCookies(+expired);
    this.analyticsService.enableGoogleTagManager();
  }

  rejectCookies(expired: string) {
    this.cookiesService.rejectAllCookies(+expired);
  }
}
