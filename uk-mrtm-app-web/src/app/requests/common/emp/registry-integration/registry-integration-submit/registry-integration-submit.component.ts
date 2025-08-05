import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { OperatorAccountsStore, selectCurrentAccount } from '@accounts/store';
import { empCommonQuery } from '@requests/common/emp/+state';
import { RegistryIntegrationApiService } from '@requests/common/emp/registry-integration/services';
import { RegistryOperatorDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-registry-integration-submit',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    RegistryOperatorDetailsSummaryTemplateComponent,
  ],
  templateUrl: './registry-integration-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryIntegrationSubmitComponent {
  private readonly requestTaskStore = inject(RequestTaskStore);
  private readonly operatorAccountsStore = inject(OperatorAccountsStore);
  private readonly registryIntegrationApiService = inject(RegistryIntegrationApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  operatorDetails = this.requestTaskStore.select(empCommonQuery.selectOperatorDetails)();
  account = toSignal(
    this.operatorAccountsStore.pipe(
      selectCurrentAccount,
      map((account) => account.account),
    ),
  );

  onSubmit() {
    this.registryIntegrationApiService
      .submit()
      .subscribe(() => this.router.navigate(['success'], { relativeTo: this.route }));
  }
}
