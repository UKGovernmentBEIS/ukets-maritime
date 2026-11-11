import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { FeedbackBannerComponent, PageHeadingComponent } from '@netz/common/components';
import { TabLazyDirective, TabsComponent } from '@netz/govuk-components';

import { RegulatorDataSuppliersTabComponent } from '@service-access/data-suppliers/regulator-data-suppliers-tab';
import { VerifierDataSuppliersTabComponent } from '@service-access/data-suppliers/verifier-data-suppliers-tab';
import { ExternalContactsTabComponent } from '@service-access/external-contacts/external-contacts-tab';
import { RegulatorUsersTabComponent } from '@service-access/regulators/regulator-users-tab';
import { SiteContactsTabComponent } from '@service-access/site-contacts/site-contacts-tab';
import { VerificationBodiesTabComponent } from '@service-access/verification-bodies/verification-bodies-tab';
import { VerifierDetailsTabComponent } from '@service-access/verifiers/verifier-details-tab';
import { VerifierUsersTabComponent } from '@service-access/verifiers/verifier-users-tab';

@Component({
  selector: 'mrtm-service-access',
  imports: [
    PageHeadingComponent,
    FeedbackBannerComponent,
    TabsComponent,
    TabLazyDirective,
    RegulatorUsersTabComponent,
    SiteContactsTabComponent,
    ExternalContactsTabComponent,
    VerificationBodiesTabComponent,
    RegulatorDataSuppliersTabComponent,
    VerifierDetailsTabComponent,
    VerifierUsersTabComponent,
    VerifierDataSuppliersTabComponent,
  ],
  standalone: true,
  templateUrl: './service-access.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceAccessComponent {
  private readonly roleType = inject(AuthStore).select(selectUserRoleType);

  protected readonly isRegulator = computed(() => this.roleType() === 'REGULATOR');
}
