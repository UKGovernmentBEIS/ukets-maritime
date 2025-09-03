import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';
import { isNil } from 'lodash-es';

import { AerShipAggregatedData } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, GovukSelectOption, WarningTextComponent } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerFilterByShipComponent } from '@requests/common/aer/components';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AggregatedDataListSummaryTemplateComponent, NotificationBannerComponent } from '@shared/components';
import { DropdownButtonGroupComponent, DropdownButtonItemComponent } from '@shared/components/dropdown-button-group';
import { NotificationBannerStore } from '@shared/components/notification-banner';
import { AerAggregatedDataSummaryItemDto, SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-aer-aggregated-data-list',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    DropdownButtonGroupComponent,
    DropdownButtonItemComponent,
    RouterLink,
    ReturnToTaskOrActionPageComponent,
    AerFilterByShipComponent,
    AggregatedDataListSummaryTemplateComponent,
    PendingButtonDirective,
    WarningTextComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-aggregated-data-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataListComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly currentFilter: WritableSignal<AerShipAggregatedData['imoNumber'] | null> = signal(null);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly notificationBannerStore: NotificationBannerStore = inject(NotificationBannerStore);
  private readonly form: UntypedFormGroup = new UntypedFormGroup({});

  public readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly wizardMap: SubTaskListMap<AerShipAggregatedData> = aerAggregatedDataSubtasksListMap;
  public readonly wizardStep: typeof AerAggregatedDataWizardStep = AerAggregatedDataWizardStep;
  public readonly allAggregatedData = this.store.select(aerCommonQuery.selectAggregatedDataList);

  public readonly canFetchFromPortsAndVoyages: Signal<boolean> = computed(() =>
    [
      this.store.select(aerCommonQuery.selectStatusForVoyagesSubtask)(),
      this.store.select(aerCommonQuery.selectStatusForPortsSubtask)(),
    ].includes(TaskItemStatus.COMPLETED),
  );

  public data: Signal<Array<AerAggregatedDataSummaryItemDto>> = computed(() => {
    const currentFilter = this.currentFilter();
    const allItems = this.allAggregatedData();

    return isNil(currentFilter) ? allItems : allItems.filter((item) => item.imoNumber === currentFilter);
  });

  public readonly filterAggregatedDataSelectItems: Signal<Array<GovukSelectOption>> = computed(() => {
    const allShips = this.allAggregatedData().map((data) => ({
      value: data.imoNumber,
      text: `${data?.shipName} (IMO: ${data.imoNumber})`,
    }));

    const uniqueImoNumbers = Array.from(new Set(allShips.map((x) => x.value)));

    return [
      { value: null, text: 'All ships' },
      ...uniqueImoNumbers.map((imoNumber) => allShips.find((x) => x.value === imoNumber)),
    ];
  });

  public readonly aggregatedDataListHeader = computed(() => {
    const selectedShip = this.currentFilter();
    const allShips = this.filterAggregatedDataSelectItems();

    return isNil(selectedShip)
      ? 'Aggregated data of all ships'
      : `Aggregated data of ${allShips.find((x) => x.value === selectedShip)?.text}`;
  });

  public readonly warningMessage: Signal<string> = computed(() => {
    const aggregatedData = this.allAggregatedData().filter((data) => data.status === 'NEEDS_REVIEW');

    if (aggregatedData.length === 0) {
      return undefined;
    }

    return aggregatedData.find((data) => !data.canViewDetails)
      ? 'You must go back to the "Ships and emission details list" task and complete the ship details for any records with the status "Needs review".'
      : 'The aggregated data has been updated. Select the IMO numbers for any records that have the status ‘Needs review’ to review and confirm the information.';
  });

  public readonly canContinue: Signal<boolean> = computed(() => {
    const statuses = this.allAggregatedData().map((data) => data.status);

    return this.editable() && statuses.length && statuses.every((task) => task === TaskItemStatus.COMPLETED);
  });

  public onFilterChanged(current: AerAggregatedDataSummaryItemDto['imoNumber']): void {
    this.currentFilter.set(current);
  }

  public onDelete(aggregatedData: Array<AerAggregatedDataSummaryItemDto>): void {
    this.service
      .saveSubtask(
        AER_AGGREGATED_DATA_SUB_TASK,
        AerAggregatedDataWizardStep.DELETE_AGGREGATED_DATA,
        this.activatedRoute,
        aggregatedData,
      )
      .pipe(take(1))
      .subscribe();
  }

  public async onContinue(): Promise<void> {
    await this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  public onAddAggregatedData(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const aggregatedDataImoNumbers = (this.allAggregatedData() ?? []).map((aggregatedData) => aggregatedData.imoNumber);
    const shipsImoNumbers = (this.store.select(aerCommonQuery.selectListOfShips)() ?? [])
      .filter((ship) => ship.status === TaskItemStatus.COMPLETED)
      .map((ship) => ship?.imoNumber);

    if (shipsImoNumbers.every((shipImoNumber) => aggregatedDataImoNumbers.includes(shipImoNumber))) {
      this.form.setErrors({
        notAllowed: 'All ships already have aggregated data recorded',
      });

      this.notificationBannerStore.setInvalidForm(this.form);
      return;
    }

    this.form.reset();
    this.notificationBannerStore.reset();

    this.router.navigate([this.wizardStep.SELECT_SHIP], { relativeTo: this.activatedRoute });
  }
}
