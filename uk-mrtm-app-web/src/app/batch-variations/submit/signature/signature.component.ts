import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import { RegulatorAuthoritiesService } from '@mrtm/api';

import { SelectComponent } from '@netz/govuk-components';

import { BATCH_VARIATION_FORM } from '@batch-variations/batch-variations.types';
import { BatchVariationService } from '@batch-variations/services/batch-variation.service';
import { signatureFormProvider } from '@batch-variations/submit/signature/signature-form.provider';
import { SubmitWizardSteps } from '@batch-variations/submit/submit.helpers';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-signature',
  imports: [WizardStepComponent, ReactiveFormsModule, SelectComponent],
  standalone: true,
  templateUrl: './signature.component.html',
  providers: [signatureFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureComponent {
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly service: BatchVariationService = inject(BatchVariationService);
  private readonly regulatorAuthoritiesService: RegulatorAuthoritiesService = inject(RegulatorAuthoritiesService);
  public readonly formGroup: FormGroup = inject(BATCH_VARIATION_FORM);

  public readonly signatoryOptions = toSignal(
    this.regulatorAuthoritiesService.getCaRegulators().pipe(
      map((data) => data?.caUsers?.filter((user) => user.authorityStatus === 'ACTIVE')),
      map((regulators) =>
        regulators.map(({ userId, firstName, lastName }) => ({
          text: `${firstName} ${lastName}`,
          value: userId,
        })),
      ),
    ),
  );

  public onSubmit(): void {
    this.service.save(this.formGroup.value);
    this.router.navigate([SubmitWizardSteps.SUMMARY], { relativeTo: this.activatedRoute });
  }
}
