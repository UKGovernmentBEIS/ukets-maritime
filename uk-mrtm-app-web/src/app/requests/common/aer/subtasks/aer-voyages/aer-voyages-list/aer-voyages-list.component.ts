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
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-subtask-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationBannerComponent, VoyagesListSummaryTemplateComponent } from '@shared/components';
import { AerVoyageSummaryItemDto } from '@shared/types';

@Component({
  selector: 'mrtm-aer-voyages-list',
  standalone: true,
  imports: [
    PageHeadingComponent,
    LinkDirective,
    ButtonDirective,
    RouterLink,
    ReturnToTaskOrActionPageComponent,
    ReactiveFormsModule,
    VoyagesListSummaryTemplateComponent,
    PendingButtonDirective,
    AerFilterByShipComponent,
    WarningTextComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-voyages-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVoyagesListComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  public readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly wizardMap = aerVoyagesMap;
  public readonly wizardStep = AerVoyagesWizardStep;
  public readonly allVoyages = this.store.select(aerCommonQuery.selectVoyagesList);
  public readonly currentFilter = signal(null);

  public readonly voyages = computed(() => {
    const currentFilter = this.currentFilter();
    const data = this.allVoyages();

    return (data ?? []).filter((voyage) => (!isNil(currentFilter) ? voyage.imoNumber === currentFilter : true));
  });

  public readonly filterVoyagesSelectItems: Signal<Array<GovukSelectOption>> = computed(() => {
    const allVoyages = this.allVoyages();
    const uniqueImoNumbers = Array.from(new Set(allVoyages.map((x) => x.imoNumber)));

    return [
      { value: null, text: 'All ships' },
      ...uniqueImoNumbers
        .map((imoNumber) => {
          const port = allVoyages.find((item) => item.imoNumber === imoNumber);

          return {
            value: imoNumber,
            text: `${port?.shipName} (IMO: ${imoNumber})`,
          };
        })
        .filter((obj, index, arr) => arr.filter((item) => item.value === obj.value).length <= 1),
    ];
  });

  public readonly voyagesListHeader = computed(() => {
    const selectedShip = this.currentFilter();
    const allShips = this.filterVoyagesSelectItems();

    return isNil(selectedShip)
      ? 'Voyages of all ships'
      : `Voyages of ${allShips.find((x) => x.value === selectedShip)?.text}`;
  });

  public readonly canContinue: Signal<boolean> = computed(() => {
    const statuses = this.allVoyages().map((voyage) => voyage.status);
    return this.editable() && statuses?.length && statuses?.every((task) => task === TaskItemStatus.COMPLETED);
  });

  public readonly warningMessage: Signal<string> = computed(() => {
    const voyages = this.allVoyages().filter((voyage) => voyage.status === 'NEEDS_REVIEW');

    if (voyages.length === 0) {
      return undefined;
    }

    return voyages.find((voyage) => !voyage.canViewDetails)
      ? 'You must go back to the "Ships and emission details list" task and complete the ship details for any records with the status "Needs review".'
      : 'The voyage and emission details have been updated. Select the IMO numbers for any records that have the status ‘Needs review’ to review and confirm the information.';
  });

  public onFilter(imoNumber: AerVoyageSummaryItemDto['imoNumber']): void {
    this.currentFilter.set(imoNumber);
  }

  public onDelete(voyages: Array<AerVoyageSummaryItemDto>): void {
    this.service
      .saveSubtask(AER_VOYAGES_SUB_TASK, AerVoyagesWizardStep.DELETE_VOYAGE, this.activatedRoute, voyages)
      .pipe(take(1))
      .subscribe();
  }

  public onContinue(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
