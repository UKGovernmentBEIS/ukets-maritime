import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports/aer-ports-subtask-list.map';
import { FilterByShipAndDateRange, FilterByShipAndDateRangeComponent } from '@requests/common/components';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationBannerComponent, PortCallsListSummaryTemplateComponent } from '@shared/components';
import { NotificationBannerStore } from '@shared/components/notification-banner';
import { AerPortSummaryItemDto } from '@shared/types';
import { isSameDayOrAfter, isSameDayOrBefore } from '@shared/utils/dates.utils';

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
    FilterByShipAndDateRangeComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-ports-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerPortsListComponent {
  private readonly formGroup = new UntypedFormGroup({});
  private readonly notificationBannerStore = inject(NotificationBannerStore);
  private readonly store = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly filter = signal<FilterByShipAndDateRange | null>(null);
  private readonly allPortCalls = this.store.select(aerCommonQuery.selectPortsList);

  readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  readonly wizardStep = AerPortsWizardStep;
  readonly wizardMap = aerPortsMap;
  readonly shipsWithPortCalls = this.store.select(aerCommonQuery.selectListOfShipsWithPortCalls);

  readonly filteredPortCalls = computed<AerPortSummaryItemDto[]>(() => {
    const filteredByShip = this.filter()?.imoNumber
      ? this.allPortCalls().filter((portCall) => portCall.imoNumber === this.filter()?.imoNumber)
      : this.allPortCalls();

    if (this.filter()?.arrivalDate && this.filter()?.departureDate) {
      // find all the port calls within arrivalDate - departureDate range
      const filteredByShipAndDates = filteredByShip.filter(
        (portCall) =>
          isSameDayOrAfter(new Date(portCall.arrivalTime), this.filter()?.arrivalDate) &&
          isSameDayOrBefore(new Date(portCall.departureTime), this.filter()?.departureDate),
      );
      return filteredByShipAndDates;
    }
    return filteredByShip;
  });

  readonly portsListHeader = computed<string>(() =>
    this.filter()?.shipName ? `Port calls of ${this.filter()?.shipName}` : 'Port calls of all ships',
  );

  readonly canContinue = computed<boolean>(() => this.editable() && this.allPortCalls()?.length > 0);

  private readonly needsReviewMessage = computed<string>(() => {
    const needsReviewPortCalls = this.allPortCalls().filter(
      (portCall) => portCall.status === TaskItemStatus.NEEDS_REVIEW,
    );

    if (needsReviewPortCalls.length === 0) {
      return undefined;
    }

    return needsReviewPortCalls.find((portCall) => !portCall.canViewDetails)
      ? 'You must go back to the ‘Ships and emission details list’ task and complete the ship details for any entries with the status ‘Needs review’.'
      : 'The port calls and emission details have been updated. Select the Ship name for any entries that have the status ‘Needs review’ to review and confirm the information.';
  });

  private readonly notCompletedMessage = computed<string>(() => {
    const isIncomplete = this.allPortCalls().some((portCall) => portCall.status === TaskItemStatus.IN_PROGRESS);
    return isIncomplete ? 'Enter the missing details for all entries with the status ‘Incomplete’' : undefined;
  });

  readonly warningMessages = computed<string[]>(() =>
    [this.needsReviewMessage(), this.notCompletedMessage()].filter((message) => message),
  );

  readonly emptyTableText = computed<string>(() =>
    this.allPortCalls()?.length > this.filteredPortCalls()?.length
      ? 'There are no matching results'
      : 'No items to display',
  );

  onDelete(portCalls: Array<AerPortSummaryItemDto>): void {
    if (portCalls.length) {
      this.formGroup.reset();
      this.notificationBannerStore.reset();

      this.service
        .saveSubtask(AER_PORTS_SUB_TASK, AerPortsWizardStep.DELETE_PORT, this.activatedRoute, portCalls)
        .pipe(take(1))
        .subscribe();
    } else {
      this.formGroup.setErrors({ NONE_SELECTED: 'Select the port calls to delete' });
      this.notificationBannerStore.setInvalidForm(this.formGroup);
    }
  }

  onFilterChanged(filterValue: FilterByShipAndDateRange): void {
    this.filter.set(filterValue);
  }

  onContinue(): void {
    const errors: ValidationErrors = {};
    let isValid = true;

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

    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
