import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';
import { isNil } from 'lodash-es';

import { AerShipAggregatedData } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, WarningTextComponent } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import { FilterByShip, FilterByShipComponent } from '@requests/common/components';
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
    FilterByShipComponent,
    AggregatedDataListSummaryTemplateComponent,
    PendingButtonDirective,
    WarningTextComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-aggregated-data-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataListComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationBannerStore = inject(NotificationBannerStore);
  private readonly formGroup = new UntypedFormGroup({});
  private readonly shipsWithoutAggregatedData = computed(() =>
    this.store
      .select(aerCommonQuery.selectListOfShipsWithoutAggregatedData(null))()
      .filter((ship) => ship.status === TaskItemStatus.COMPLETED),
  );
  private readonly aggregatedDataList = this.store.select(aerCommonQuery.selectAggregatedDataList);

  readonly filter = signal<FilterByShip | null>(null);
  readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  readonly shipsWithAggregatedData = this.store.select(aerCommonQuery.selectListOfShipsWithAggregatedData);
  readonly wizardMap: SubTaskListMap<AerShipAggregatedData> = aerAggregatedDataSubtasksListMap;
  readonly wizardStep = AerAggregatedDataWizardStep;

  readonly canFetchFromPortsAndVoyages = computed<boolean>(() =>
    [
      this.store.select(aerCommonQuery.selectStatusForVoyagesSubtask)(),
      this.store.select(aerCommonQuery.selectStatusForPortsSubtask)(),
    ].includes(TaskItemStatus.COMPLETED),
  );

  readonly filteredAggregatedDataList = computed<AerAggregatedDataSummaryItemDto[]>(() => {
    const imoNumber = this.filter()?.imoNumber;
    const allItems = this.aggregatedDataList();

    return isNil(imoNumber) ? allItems : allItems.filter((item) => item.imoNumber === imoNumber);
  });

  readonly aggregatedDataListHeader = computed<string>(() =>
    this.filter()?.shipName ? `Aggregated data of ${this.filter()?.shipName}` : 'Aggregated data of all ships',
  );

  private readonly noImoReferenceMessage = computed<string>(() => {
    const allShipsImoNumbers = this.store
      .select(aerCommonQuery.selectShips)()
      ?.map((ship) => ship?.details?.imoNumber);

    const isIncomplete = this.aggregatedDataList().some(
      (aggregatedDataItem) => !allShipsImoNumbers?.includes(aggregatedDataItem?.imoNumber),
    );
    return isIncomplete
      ? `Some aggregated data are not linked to ships in the 'Ships and emission details list' subtask. Check the Aggregated data list and make any changes needed.`
      : undefined;
  });

  private readonly needsReviewMessage = computed<string>(() => {
    const needsReviewAggregatedData = this.aggregatedDataList().filter(
      (aggregatedDataItem) => aggregatedDataItem.status === TaskItemStatus.NEEDS_REVIEW,
    );

    if (needsReviewAggregatedData.length === 0) {
      return undefined;
    }

    return needsReviewAggregatedData.find((data) => !data.canViewDetails)
      ? `Some aggregated data entries have ships with incomplete status. Confirm and complete the ship status from the 'Ships and emission details list' subtask, then review the aggregated data again.`
      : `The aggregated data has been updated due to changes made to the 'Ships and emission details list' subtask. Review the information for each aggregated data entry, then select Confirm and continue.`;
  });

  private readonly notCompletedMessage = computed<string>(() => {
    const hasIncompleteAggregatedData: boolean = this.aggregatedDataList().some(
      (aggregatedDataItem) => aggregatedDataItem.status === TaskItemStatus.IN_PROGRESS,
    );
    return hasIncompleteAggregatedData
      ? `Enter the missing details for all entries with the status 'Incomplete'`
      : undefined;
  });

  readonly warningMessages = computed<string[]>(() =>
    [this.noImoReferenceMessage(), this.needsReviewMessage(), this.notCompletedMessage()].filter((message) => message),
  );

  readonly canContinue = computed<boolean>(() => this.editable() && this.aggregatedDataList()?.length > 0);

  onFilterChanged({ imoNumber, shipName }: FilterByShip): void {
    this.filter.set({ imoNumber, shipName });
  }

  onDelete(aggregatedDataItems: Array<AerAggregatedDataSummaryItemDto>): void {
    if (aggregatedDataItems.length) {
      this.formGroup.reset();
      this.notificationBannerStore.reset();

      this.service
        .saveSubtask(
          AER_AGGREGATED_DATA_SUB_TASK,
          AerAggregatedDataWizardStep.DELETE_AGGREGATED_DATA,
          this.activatedRoute,
          aggregatedDataItems,
        )
        .pipe(take(1))
        .subscribe();
    } else {
      this.formGroup.setErrors({ NONE_SELECTED: 'Select the aggregated data to delete' });
      this.notificationBannerStore.setInvalidForm(this.formGroup);
    }
  }

  async onContinue(): Promise<void> {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (this.noImoReferenceMessage()) {
      errors['NO_IMO_REFERENCE'] = this.noImoReferenceMessage();
      isValid = false;
    }

    if (this.notCompletedMessage()) {
      errors['NOT_COMPLETED'] = this.notCompletedMessage();
      isValid = false;
    }

    if (this.needsReviewMessage()) {
      errors['NEEDS_REVIEW'] = this.needsReviewMessage();
      isValid = false;
    }

    if (!isValid) {
      this.formGroup.setErrors(errors);
      this.notificationBannerStore.setInvalidForm(this.formGroup);
      return;
    }

    this.formGroup.reset();
    this.notificationBannerStore.reset();

    await this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onAddAggregatedData(): void {
    if (this.shipsWithoutAggregatedData().length === 0) {
      this.formGroup.setErrors({ notAllowed: 'All ships already have aggregated data recorded' });
      this.notificationBannerStore.setInvalidForm(this.formGroup);
      return;
    }

    this.formGroup.reset();
    this.notificationBannerStore.reset();

    this.router.navigate([this.wizardStep.SELECT_SHIP], { relativeTo: this.activatedRoute });
  }
}
