import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TextareaComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { ReturnToOperatorForChangesStore } from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state/return-to-operator-for-changes.store';
import { returnToOperatorForChangesFormProvider } from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/return-to-operator-for-changes-form/return-to-operator-for-changes-form.form-provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-return-to-operator-for-changes-form',
  standalone: true,
  imports: [ReactiveFormsModule, WizardStepComponent, TextareaComponent],
  templateUrl: './return-to-operator-for-changes-form.component.html',
  styleUrl: './return-to-operator-for-changes-form.component.scss',
  providers: [returnToOperatorForChangesFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToOperatorForChangesFormComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly store = inject(ReturnToOperatorForChangesStore);

  onSubmit() {
    this.store.setState({ changesRequired: this.form.get('changesRequired').value, isSubmitted: false });
    this.router.navigate(['summary'], { relativeTo: this.route });
  }
}
