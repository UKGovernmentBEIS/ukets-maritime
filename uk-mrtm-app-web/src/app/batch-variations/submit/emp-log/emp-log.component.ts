import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TextareaComponent } from '@netz/govuk-components';

import { BATCH_VARIATION_FORM } from '@batch-variations/batch-variations.types';
import { BatchVariationService } from '@batch-variations/services/batch-variation.service';
import { empLogFormProvider } from '@batch-variations/submit/emp-log/emp-log-form.provider';
import { SubmitWizardSteps } from '@batch-variations/submit/submit.helpers';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emp-log',
  imports: [WizardStepComponent, TextareaComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './emp-log.component.html',
  providers: [empLogFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpLogComponent {
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly service = inject(BatchVariationService);

  public readonly formGroup: FormGroup = inject(BATCH_VARIATION_FORM);

  public onSubmit(): void {
    this.service.save(this.formGroup.value);
    this.router.navigate(['../', SubmitWizardSteps.SIGNATURE], { relativeTo: this.activatedRoute });
  }
}
