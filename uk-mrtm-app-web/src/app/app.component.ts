import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { AuthStore, selectIsLoggedIn, selectUserState } from '@netz/common/auth';
import { BackLinkComponent, BreadcrumbsComponent } from '@netz/common/navigation';
import { DestroySubject } from '@netz/common/services';
import {
  GovukFooterComponent,
  GovukHeaderComponent,
  GovukLinkItem,
  GovukServiceNavigationComponent,
  GovukServiceNavigationItem,
  GovukSkipLinkComponent,
  LinkDirective,
} from '@netz/govuk-components';

import { CookiesService } from '@cookies/cookies.service';
import { CookiesContainerComponent } from '@cookies/cookies-container.component';
import { ConfigStore, selectIsFeatureEnabled } from '@core/config';
import { AuthService } from '@core/services';
import { AnalyticsService } from '@core/services/analytics.service';
import { hasNoAuthority, loginDisabled, shouldShowAccepted } from '@core/util';
import { IncorporateHeaderComponent } from '@incorporate-header/incorporate-header.component';
import { PhaseBarComponent } from '@shared/components';
import { SkipLinkFocusDirective } from '@shared/directives';
import { TimeoutBannerComponent } from '@timeout/timeout-banner';

interface Permissions {
  showRegulators: boolean;
  showVerifiers: boolean;
  showAuthorizedOperators: boolean;
}

@Component({
  selector: 'mrtm-root',
  imports: [
    CookiesContainerComponent,
    PhaseBarComponent,
    BreadcrumbsComponent,
    BackLinkComponent,
    RouterOutlet,
    GovukFooterComponent,
    TimeoutBannerComponent,
    IncorporateHeaderComponent,
    GovukHeaderComponent,
    GovukServiceNavigationComponent,
    LinkDirective,
    GovukSkipLinkComponent,
    SkipLinkFocusDirective,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  providers: [DestroySubject],
})
export class AppComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly configStore = inject(ConfigStore);
  private readonly cookiesService = inject(CookiesService);
  private readonly analyticsService = inject(AnalyticsService);

  readonly serviceGatewayUrl: string = location.origin;
  readonly isGatewayServiceEnabled = toSignal(this.configStore.pipe(selectIsFeatureEnabled('serviceGatewayEnabled')), {
    initialValue: false,
  });
  readonly isLoggedIn = this.authStore.select(selectIsLoggedIn);
  readonly showCookiesBanner = !this.cookiesService.accepted$.getValue();
  readonly footerMetaLinks: GovukLinkItem[] = [
    { text: 'Privacy Notice', href: '/privacy-notice' },
    { text: 'Contact us', href: '/contact-us' },
    { text: 'Accessibility Statement', routerLink: '/accessibility' },
    { text: 'Legislation', routerLink: '/legislation' },
  ];
  private readonly userState = this.authStore.select(selectUserState);
  readonly permissions = computed<Permissions | null>(() => {
    const userState = this.userState();

    if (!this.isLoggedIn() || loginDisabled(userState) || shouldShowAccepted(userState)) {
      return null;
    }

    const showRegulators = userState?.roleType === 'REGULATOR';
    const showVerifiers = userState?.roleType === 'VERIFIER';
    const showAuthorizedOperators =
      userState !== null && userState.roleType === 'OPERATOR' && !hasNoAuthority(userState);

    return showRegulators || showVerifiers || showAuthorizedOperators
      ? { showRegulators, showVerifiers, showAuthorizedOperators }
      : null;
  });
  readonly navigationItems = computed<GovukServiceNavigationItem[]>(() => {
    const permissions = this.permissions();
    if (!permissions) {
      return [];
    }

    const showCommon = permissions.showRegulators || permissions.showAuthorizedOperators || permissions.showVerifiers;

    return [
      ...(showCommon
        ? [
            { routerLink: '/dashboard', text: 'Tasks' },
            { routerLink: '/accounts', text: 'Accounts' },
          ]
        : []),
      ...(permissions.showRegulators || permissions.showVerifiers
        ? [{ routerLink: '/service-access', text: 'Service access' }]
        : []),
      ...(permissions.showRegulators
        ? [
            { routerLink: '/templates', text: 'Templates' },
            { routerLink: '/mi-reports', text: 'MI Reports' },
            { routerLink: '/batch-variations', text: 'Batch variations' },
          ]
        : []),
      ...(permissions.showAuthorizedOperators ? [{ routerLink: '/cdm', text: 'API data management' }] : []),
      ...(showCommon ? [{ routerLink: '/guidance', text: 'Guidance' }] : []),
    ];
  });

  ngOnInit(): void {
    if (this.cookiesService.accepted$.getValue() && this.cookiesService.hasAnalyticsConsent()) {
      this.analyticsService.enableGoogleTagManager();
    }
  }

  public async logout(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    await this.authService.logout();
  }
}
