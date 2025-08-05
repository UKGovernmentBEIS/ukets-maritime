import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { ListOfShipsTableComponent } from '@requests/common/components/emissions';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionsSubTasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { MultiSelectedItem, NotificationBannerComponent } from '@shared/components';
import { ShipEmissionTableListItem } from '@shared/types';

@Component({
  selector: 'mrtm-list-of-ships',
  standalone: true,
  imports: [
    ListOfShipsTableComponent,
    NotificationBannerComponent,
    PendingButtonDirective,
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './list-of-ships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  readonly taskMap = emissionsSubTasksMap;
  readonly listOfShips = this.store.select(empCommonQuery.selectListOfShips);
  readonly canContinue = computed(
    () => this.listOfShips()?.length && this.listOfShips()?.every((ship) => ship.status === TaskItemStatus.COMPLETED),
  );

  onContinue() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onAddNew() {
    this.router.navigate(['../ships', crypto.randomUUID()], { relativeTo: this.activatedRoute });
  }

  onUploadFile() {
    this.router.navigate(['../' + EmissionsWizardStep.UPLOAD_SHIPS], { relativeTo: this.activatedRoute });
  }

  onDeleteShips(ships: MultiSelectedItem<ShipEmissionTableListItem>[]) {
    this.router.navigate(['../', EmissionsWizardStep.DELETE_SHIPS], {
      relativeTo: this.activatedRoute,
      state: { ships: ships.map((ship) => ship.uniqueIdentifier) },
      skipLocationChange: true,
      queryParamsHandling: 'merge',
    });
  }
}
