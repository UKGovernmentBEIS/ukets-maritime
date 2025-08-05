import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { KeycloakProfile } from 'keycloak-js';

import { UserStateDTO } from '@mrtm/api';

import { AuthStore, selectIsLoggedIn, selectUserProfile, selectUserRoleType, selectUserState } from '@netz/common/auth';
import { PageHeadingComponent } from '@netz/common/components';
import { DestroySubject } from '@netz/common/services';
import { LinkDirective } from '@netz/govuk-components';

import { AuthService } from '@core/services/auth.service';
import { BackToTopComponent, ServiceBannerComponent } from '@shared/components';

interface ViewModel {
  isLoggedIn: boolean;
  userProfile: KeycloakProfile;
  roleType: UserStateDTO['roleType'];
  status: UserStateDTO['status'];
}

@Component({
  selector: 'mrtm-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
  imports: [
    PageHeadingComponent,
    RouterLink,
    BackToTopComponent,
    NgTemplateOutlet,
    NgOptimizedImage,
    ServiceBannerComponent,
    LinkDirective,
  ],
})
export class LandingPageComponent implements OnInit {
  vm: Signal<ViewModel> = computed(() => {
    return {
      isLoggedIn: this.authStore.select(selectIsLoggedIn)(),
      userProfile: this.authStore.select(selectUserProfile)(),
      roleType: this.authStore.select(selectUserRoleType)(),
      status: this.authStore.select(selectUserState)()?.status,
    };
  });

  private readonly authStore = inject(AuthStore);
  public readonly authService = inject(AuthService);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Maritime');
  }
}
