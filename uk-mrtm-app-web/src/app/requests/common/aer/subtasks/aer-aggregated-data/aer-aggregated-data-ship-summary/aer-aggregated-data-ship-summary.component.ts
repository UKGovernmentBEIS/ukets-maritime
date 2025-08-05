import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';
import { isNil } from 'lodash-es';

import { AerFuelConsumption, AerShipAggregatedData, AerShipEmissions } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import { validateIfUsedFuelsExistInEmissionsValidator } from '@requests/common/aer/subtasks/utils';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationBannerComponent, NotificationBannerStore } from '@shared/components/notification-banner';
import { AerAggregatedDataShipSummaryTemplateComponent } from '@shared/components/summaries';
import { AerPortSummaryItemDto, AerVoyageSummaryItemDto } from '@shared/types';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'mrtm-aer-aggregated-data-ship-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    RouterLink,
    LinkDirective,
    ButtonDirective,
    PendingButtonDirective,
    AerAggregatedDataShipSummaryTemplateComponent,
    WarningTextComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-aggregated-data-ship-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataShipSummaryComponent {
  readonly form = new UntypedFormGroup({});
  readonly dataId: InputSignal<string> = input<string>();
  readonly wizardMap = aerAggregatedDataSubtasksListMap;
  readonly showWarningMessage: Signal<boolean> = computed(() => {
    const { fromFetch, relatedPorts, relatedVoyages } = this.aggregatedData() ?? {};

    return fromFetch && !relatedPorts.length && !relatedVoyages.length;
  });
  private readonly notificationBannerStore: NotificationBannerStore = inject(NotificationBannerStore);
  private readonly store = inject(RequestTaskStore);
  readonly aggregatedData: Signal<
    AerShipAggregatedData & {
      status: TaskItemStatus;
      relatedPorts?: AerPortSummaryItemDto[];
      relatedShip: AerShipEmissions & { status: TaskItemStatus };
      relatedVoyages?: AerVoyageSummaryItemDto[];
    }
  > = computed(() => this.store.select(aerCommonQuery.selectAggregatedDataItem(this.dataId()))());
  readonly editable: Signal<boolean> = computed(() => {
    return !this.aggregatedData()?.fromFetch && this.store.select(requestTaskQuery.selectIsEditable)();
  });

  readonly canSubmit: Signal<boolean> = computed(() => {
    const editable = this.store.select(requestTaskQuery.selectIsEditable)();
    const { status, fromFetch, relatedPorts, relatedVoyages } = this.aggregatedData() ?? {};

    if (!editable || status === TaskItemStatus.COMPLETED) {
      return false;
    }

    return (
      !fromFetch ||
      (fromFetch &&
        (relatedPorts?.length || relatedVoyages?.length) &&
        ((relatedPorts?.length && relatedPorts.every((port) => port?.status === TaskItemStatus.COMPLETED)) ||
          (relatedVoyages?.length && relatedVoyages.every((voyage) => voyage?.status === TaskItemStatus.COMPLETED))))
    );
  });
  readonly ship: Signal<AerShipEmissions> = computed(() =>
    this.store.select(aerCommonQuery.selectRelatedShipForAggregatedData(this.dataId()))(),
  );
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);

  onSubmit(): void {
    const { totalShipEmissions, surrenderEmissions, fuelConsumptions, relatedShip } = this.aggregatedData() ?? {};
    const errors: ValidationErrors =
      validateIfUsedFuelsExistInEmissionsValidator(fuelConsumptions as Array<AerFuelConsumption>, relatedShip) ?? {};
    let isValid = Object.keys(errors).length === 0;

    if (isNil(totalShipEmissions) || new BigNumber(totalShipEmissions).lte(0)) {
      errors['totalEmissions'] = 'The total in port emissions should be greater than 0';
      isValid = false;
    }

    if (!isNil(surrenderEmissions) && new BigNumber(surrenderEmissions).lt(0)) {
      errors['surrenderEmissions'] = 'The emissions figure for surrender should be greater than or equal to 0';
      isValid = false;
    }

    if (!isValid) {
      this.form.setErrors(errors);
      this.notificationBannerStore.setInvalidForm(this.form);
      return;
    }

    this.service
      .saveSubtask(
        AER_AGGREGATED_DATA_SUB_TASK,
        AerAggregatedDataWizardStep.AGGREGATED_DATA_SUMMARY,
        this.activatedRoute,
        this.dataId(),
      )
      .pipe(take(1))
      .subscribe();
  }
}
