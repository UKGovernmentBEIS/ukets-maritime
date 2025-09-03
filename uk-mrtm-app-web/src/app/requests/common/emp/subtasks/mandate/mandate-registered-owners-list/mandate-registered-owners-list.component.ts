import { ChangeDetectionStrategy, Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { EmpRegisteredOwner } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { mandateSubtaskMap } from '@requests/common/emp/subtasks/mandate/mandate-subtask-list.map';
import { MandateRegisteredOwnersListSummaryTemplateComponent, XmlErrorSummaryComponent } from '@shared/components';
import { NestedMessageValidationError, XmlValidationError } from '@shared/types';

@Component({
  selector: 'mrtm-mandate-registered-owners-list',
  standalone: true,
  imports: [
    PageHeadingComponent,
    RouterLink,
    ButtonDirective,
    MandateRegisteredOwnersListSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReactiveFormsModule,
    XmlErrorSummaryComponent,
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

  public readonly wizardMap = mandateSubtaskMap;
  public readonly wizardSteps = MandateWizardStep;

  public readonly isEditable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly data: Signal<Array<EmpRegisteredOwner & { needsReview: boolean }>> = this.store.select(
    empCommonQuery.selectMandateRegisteredOwnersList,
  );

  public readonly validationErrors: WritableSignal<Array<XmlValidationError>> = signal([]);

  public onSubmit(): void {
    this.validationErrors.set(undefined);
    const errors: Array<XmlValidationError> = [];

    for (const registeredOwner of this.data()) {
      if (registeredOwner.needsReview) {
        errors.push({
          column: 'NO_FIELD',
          row: registeredOwner.name,
          message: 'All registered owners must have at least one associated ship',
        });
      }
    }

    if (errors.length > 0) {
      this.validationErrors.set(errors);
      return;
    }

    this.router.navigate(['../', this.wizardSteps.RESPONSIBILITY_DECLARATION], { relativeTo: this.activatedRoute });
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
        this.wizardSteps.DELETE_REGISTERED_OWNER,
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
