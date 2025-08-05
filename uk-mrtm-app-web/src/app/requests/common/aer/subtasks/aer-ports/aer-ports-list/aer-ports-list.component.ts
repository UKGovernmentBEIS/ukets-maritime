import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';
import { isNil } from 'lodash-es';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, GovukSelectOption, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerFilterByShipComponent } from '@requests/common/aer/components';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports/aer-ports-subtask-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationBannerComponent, PortCallsListSummaryTemplateComponent } from '@shared/components';
import { AerPortSummaryItemDto } from '@shared/types';

@Component({
  selector: 'mrtm-aer-ports-list',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    PortCallsListSummaryTemplateComponent,
    LinkDirective,
    RouterLink,
    ReactiveFormsModule,
    PendingButtonDirective,
    AerFilterByShipComponent,
    WarningTextComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-ports-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerPortsListComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  public readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly wizardStep = AerPortsWizardStep;
  public readonly wizardMap = aerPortsMap;
  public readonly currentFilter = signal(null);
  public readonly allPorts = this.store.select(aerCommonQuery.selectPortsList);

  public readonly warningMessage: Signal<string> = computed(() => {
    const ports = this.allPorts().filter((port) => port.status === 'NEEDS_REVIEW');

    if (ports.length === 0) {
      return undefined;
    }

    return ports.find((port) => !port.canViewDetails)
      ? 'You must go back to the "Ships and emission details list" task and complete the ship details for any records with the status "Needs review".'
      : 'The port calls and emission details have been updated. Select the IMO numbers for any records that have the status ‘Needs review’ to review and confirm the information.';
  });

  public readonly ports = computed(() => {
    const currentFilter = this.currentFilter();
    const data = this.allPorts();

    return (data ?? []).filter((port) => (!isNil(currentFilter) ? port.imoNumber === currentFilter : true));
  });

  public readonly filterPortsSelectItems: Signal<Array<GovukSelectOption>> = computed(() => {
    const allPorts = this.allPorts();
    const uniqueImoNumbers = Array.from(new Set(allPorts.map((x) => x.imoNumber)));

    return [
      { value: null, text: 'All ships' },
      ...uniqueImoNumbers
        .map((imoNumber) => {
          const port = allPorts.find((item) => item.imoNumber === imoNumber);

          return {
            value: imoNumber,
            text: `${port?.shipName} (IMO: ${imoNumber})`,
          };
        })
        .filter((obj, index, arr) => arr.filter((item) => item.value === obj.value).length <= 1),
    ];
  });

  public readonly portsListHeader = computed(() => {
    const selectedShip = this.currentFilter();
    const allShips = this.filterPortsSelectItems();

    return isNil(selectedShip)
      ? 'Port calls of all ships'
      : `Port calls of ${allShips.find((x) => x.value === selectedShip)?.text}`;
  });

  public readonly canContinue: Signal<boolean> = computed(() => {
    const statuses = this.allPorts().map((port) => port.status);
    return this.editable() && statuses?.length && statuses?.every((task) => task === TaskItemStatus.COMPLETED);
  });

  public onDeletePorts(ports: Array<AerPortSummaryItemDto>): void {
    this.service
      .saveSubtask(AER_PORTS_SUB_TASK, AerPortsWizardStep.DELETE_PORT, this.activatedRoute, ports)
      .pipe(take(1))
      .subscribe();
  }

  public onFilter(imoNumber: AerPortSummaryItemDto['imoNumber']): void {
    this.currentFilter.set(imoNumber);
  }

  public onContinue(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
