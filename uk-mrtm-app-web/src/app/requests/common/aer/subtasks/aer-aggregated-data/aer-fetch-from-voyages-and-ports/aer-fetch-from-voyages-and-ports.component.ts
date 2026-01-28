import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import { NotificationBannerComponent } from '@shared/components';
import { NotificationBannerStore } from '@shared/components/notification-banner';
import { AerJourneyTypeEnum } from '@shared/types';

@Component({
  selector: 'mrtm-aer-fetch-from-voyages-and-ports',
  standalone: true,
  imports: [
    PageHeadingComponent,
    WarningTextComponent,
    ButtonDirective,
    RouterLink,
    LinkDirective,
    PendingButtonDirective,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-fetch-from-voyages-and-ports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerFetchFromVoyagesAndPortsComponent {
  public readonly wizardMap = aerAggregatedDataSubtasksListMap;
  public readonly wizardStep = AerAggregatedDataWizardStep;

  private readonly store = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly notificationBannerStore = inject(NotificationBannerStore);
  private readonly form: UntypedFormGroup = new UntypedFormGroup({});

  public onSubmit(): void {
    this.notificationBannerStore.reset();
    this.form.setErrors(this.validateCanExecuteFetchFromVoyagesAndPorts());

    if (!this.form.valid) {
      this.notificationBannerStore.setInvalidForm(this.form);
      return;
    }

    this.service
      .saveSubtask(
        AER_AGGREGATED_DATA_SUB_TASK,
        this.wizardStep.FETCH_FROM_VOYAGES_AND_PORTS,
        this.activatedRoute,
        null,
      )
      .pipe(take(1))
      .subscribe();
  }

  private validateCanExecuteFetchFromVoyagesAndPorts(): ValidationErrors | undefined {
    const ports = this.store.select(aerCommonQuery.selectPortsList)();
    const voyages = this.store.select(aerCommonQuery.selectVoyagesList)();

    return !ports?.length &&
      !voyages.find((voyage) => [AerJourneyTypeEnum.Domestic, AerJourneyTypeEnum.NI].includes(voyage.journeyType))
      ? { invalid: 'There are no domestic or in‑port emissions available to import. Check your data and try again.' }
      : undefined;
  }
}
