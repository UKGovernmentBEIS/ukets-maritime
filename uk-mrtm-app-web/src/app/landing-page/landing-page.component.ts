import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { KeycloakProfile } from 'keycloak-js';

import { UserStateDTO } from '@mrtm/api';

import { AuthStore, selectIsLoggedIn, selectUserProfile, selectUserRoleType, selectUserState } from '@netz/common/auth';
import { PageHeadingComponent } from '@netz/common/components';
import { DestroySubject } from '@netz/common/services';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { AuthService } from '@core/services/auth.service';
import { ServiceBannerComponent } from '@shared/components';

interface ViewModel {
  isLoggedIn: boolean;
  userProfile: KeycloakProfile;
  roleType: UserStateDTO['roleType'];
  status: UserStateDTO['status'];
}

@Component({
  selector: 'mrtm-landing-page',
  imports: [PageHeadingComponent, NgTemplateOutlet, ServiceBannerComponent, LinkDirective, ButtonDirective],
  standalone: true,
  templateUrl: './landing-page.component.html',
  providers: [DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly authStore = inject(AuthStore);

  public readonly authService = inject(AuthService);
  readonly vm: Signal<ViewModel> = computed(() => {
    return {
      isLoggedIn: this.authStore.select(selectIsLoggedIn)(),
      userProfile: this.authStore.select(selectUserProfile)(),
      roleType: this.authStore.select(selectUserRoleType)(),
      status: this.authStore.select(selectUserState)()?.status,
    };
  });
}
