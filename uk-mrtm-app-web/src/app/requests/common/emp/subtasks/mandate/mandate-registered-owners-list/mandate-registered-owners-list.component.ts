import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';
import { isNil } from 'lodash-es';

import { EmpRegisteredOwner, RegisteredOwnerShipDetails, ShipDetails } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common';
import { MandateRegisteredOwnersTableComponent } from '@requests/common/components/mandate';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { NotificationBannerComponent, XmlErrorSummaryComponent } from '@shared/components';
import { NestedMessageValidationError, XmlValidationError } from '@shared/types';

@Component({
  selector: 'mrtm-mandate-registered-owners-list',
  standalone: true,
  imports: [
    PageHeadingComponent,
    RouterLink,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    ReactiveFormsModule,
    XmlErrorSummaryComponent,
    WarningTextComponent,
    MandateRegisteredOwnersTableComponent,
    NotificationBannerComponent,
    LinkDirective,
  ],
  templateUrl: './mandate-registered-owners-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateRegisteredOwnersListComponent {
  public readonly form: UntypedFormGroup = new UntypedFormGroup({});
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly taskService: TaskService<EmpTaskPayload> = inject(TaskService);

  public readonly wizardMap = mandateMap;
  public readonly wizardStep = MandateWizardStep;

  public readonly isEditable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly data: Signal<Array<EmpRegisteredOwner & { needsReview: boolean }>> = this.store.select(
    empCommonQuery.selectMandateRegisteredOwnersList,
  );

  public readonly validationErrors: WritableSignal<Array<XmlValidationError>> = signal([]);
  public readonly hasNeedsReviewItems: Signal<boolean> = computed(
    () => !isNil(this.data().find((ro) => ro.needsReview === true)),
  );

  public allShipsAssociated: Signal<boolean> = computed(() => {
    const allIsmShips = new Set<ShipDetails['imoNumber']>(
      this.store
        .select(empCommonQuery.selectListOfShips)()
        .filter(
          (ship) => ship.status === TaskItemStatus.COMPLETED && ship?.natureOfReportingResponsibility === 'ISM_COMPANY',
        )
        .map((ship) => ship?.imoNumber),
    );

    const registeredOwnersShips = new Set<RegisteredOwnerShipDetails['imoNumber']>(
      this.data()
        .map((registeredOwner) => registeredOwner.ships.map((ship) => ship.imoNumber))
        .flat(),
    );

    return registeredOwnersShips.size === allIsmShips.size;
  });

  public onSubmit(): void {
    this.validationErrors.set(undefined);
    const errors: Array<XmlValidationError> = [];

    if (!this.allShipsAssociated()) {
      errors.push({
        column: null,
        row: null,
        message:
          'The list of ships includes ships where the nature of responsibility lies with the ISM company, and no registered owner has been added. All relevant ships must be associated with a registered owner.',
      });
    }

    for (const registeredOwner of this.data()) {
      if (registeredOwner.needsReview) {
        errors.push({
          column: 'ASSOCIATED_SHIPS',
          row: registeredOwner.name,
          message: 'All registered owners must have at least one associated ship',
        });
      }
    }

    if (errors.length > 0) {
      this.validationErrors.set(errors);
      return;
    }

    this.router.navigate(['../', this.wizardStep.RESPONSIBILITY_DECLARATION], { relativeTo: this.activatedRoute });
  }

  public onEdit(item: EmpRegisteredOwner): void {
    this.router.navigate([MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT, item.uniqueIdentifier], {
      relativeTo: this.activatedRoute,
    });
  }

  public onDelete(item: EmpRegisteredOwner): void {
    this.taskService
      .saveSubtask(
        MANDATE_SUB_TASK,
        this.wizardStep.DELETE_REGISTERED_OWNER,
        this.activatedRoute,
        item.uniqueIdentifier,
      )
      .pipe(take(1))
      .subscribe();
  }

  public formatValidationErrorDetails(error: NestedMessageValidationError): string {
    return `Check the associated ships for ${error.rows.map((row) => `<strong>${row}</strong>`).join(', ')}`;
  }
}
