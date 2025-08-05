import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';
import { addDays } from 'date-fns';

import { ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { GovukDatePipe } from '@netz/common/pipes';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { DateInputComponent } from '@netz/govuk-components';

import { RdeWizardSteps } from '@requests/common/emp/request-deadline-extension/request-deadline-extension.consts';
import { requestDeadlineExtensionFormProvider } from '@requests/common/emp/request-deadline-extension/request-deadline-extension-form/request-deadline-extension-form.provider';
import { RequestDeadlineExtensionStore } from '@requests/common/emp/request-deadline-extension/services';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-request-deadline-extension-form',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    DateInputComponent,
    GovukDatePipe,
    ReturnToTaskOrActionPageComponent,
  ],
  providers: [requestDeadlineExtensionFormProvider],
  templateUrl: './request-deadline-extension-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDeadlineExtensionFormComponent {
  private readonly taskStore = inject(RequestTaskStore);
  private readonly rdeStore = inject(RequestDeadlineExtensionStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly inChangeStatus = toSignal(
    this.route.queryParams.pipe(map((query) => Boolean(query?.['change'] ?? false))),
  );

  public readonly deadlineDate = addDays(
    new Date(),
    this.taskStore.select(requestTaskQuery.selectRequestTask)()?.daysRemaining,
  );

  public onSubmit(): void {
    this.rdeStore.setRde({
      ...this.rdeStore.state.rdePayload,
      ...this.formGroup.value,
    });

    this.router.navigate(this.inChangeStatus() ? ['../'] : ['../', RdeWizardSteps.RDE_DEADLINE_NOTIFICATION], {
      relativeTo: this.route,
    });
  }
}
