import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, EMPTY, map, of } from 'rxjs';

import { MaritimeAccountsService, MrtmAccountViewDTO } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { aerEmissionsMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { ListOfShipsTableComponent } from '@requests/common/components/emissions';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { MultiSelectedItem, NotificationBannerComponent } from '@shared/components';
import { DropdownButtonGroupComponent, DropdownButtonItemComponent } from '@shared/components/dropdown-button-group';
import { ShipEmissionTableListItem } from '@shared/types';

@Component({
  selector: 'mrtm-aer-list-of-ships',
  standalone: true,
  imports: [
    ListOfShipsTableComponent,
    PendingButtonDirective,
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NotificationBannerComponent,
    DropdownButtonGroupComponent,
    DropdownButtonItemComponent,
  ],
  templateUrl: './aer-list-of-ships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerListOfShipsComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountService = inject(MaritimeAccountsService);

  private readonly accountId = computed(() => this.store.select(requestTaskQuery.selectRequestInfo)()?.accountId);
  private readonly accountStatus: Signal<MrtmAccountViewDTO['status']> = toSignal(
    (this.accountId() ? this.accountService.getMaritimeAccount(this.accountId()) : of(null)).pipe(
      map((response) => response.account?.status),
      catchError(() => EMPTY),
    ),
  );

  readonly canFetchFromEMP = computed(() => this.accountStatus() === 'LIVE');
  readonly map = aerEmissionsMap;
  readonly listOfShips = this.store.select(aerCommonQuery.selectListOfShips);
  readonly canContinue = computed(
    () => this.listOfShips()?.length && this.listOfShips()?.every((ship) => ship.status === TaskItemStatus.COMPLETED),
  );

  constructor() {
    if (this.activatedRoute.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onContinue() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onAddNew() {
    this.router.navigate(['../ships', crypto.randomUUID()], { relativeTo: this.activatedRoute });
  }

  onUploadFile() {
    this.router.navigate(['../' + AerEmissionsWizardStep.UPLOAD_SHIPS], { relativeTo: this.activatedRoute });
  }

  onFetchFromEMP(): void {
    this.router.navigate(['../', AerEmissionsWizardStep.FETCH_FROM_EMP], { relativeTo: this.activatedRoute });
  }

  onDeleteShips(ships: MultiSelectedItem<ShipEmissionTableListItem>[]) {
    this.router.navigate(['../', AerEmissionsWizardStep.DELETE_SHIPS], {
      relativeTo: this.activatedRoute,
      state: { ships: ships.map((ship) => ship.uniqueIdentifier) },
      skipLocationChange: true,
      queryParamsHandling: 'merge',
    });
  }
}
