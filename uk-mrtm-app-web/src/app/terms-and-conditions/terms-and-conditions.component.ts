import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { distinctUntilKeyChanged, Observable, switchMap } from 'rxjs';

import { TermsAndConditionsService, TermsDTO } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  AccordionComponent,
  AccordionItemComponent,
  ButtonDirective,
  CheckboxComponent,
  CheckboxesComponent,
  GovukValidators,
} from '@netz/govuk-components';

import { AuthService } from '@core/services/auth.service';
import { LatestTermsStore } from '@core/store/latest-terms/latest-terms.store';

@Component({
  selector: 'mrtm-terms-and-conditions',
  standalone: true,
  templateUrl: './terms-and-conditions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeadingComponent,
    AsyncPipe,
    ReactiveFormsModule,
    PendingButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    CheckboxComponent,
    CheckboxesComponent,
    ButtonDirective,
  ],
})
export class TermsAndConditionsComponent {
  private readonly router = inject(Router);
  private readonly termsAndConditionsService = inject(TermsAndConditionsService);
  private readonly authService = inject(AuthService);
  private readonly latestTermsStore = inject(LatestTermsStore);
  private readonly fb = inject(UntypedFormBuilder);
  latestTerms$: Observable<TermsDTO> = this.latestTermsStore.pipe(distinctUntilKeyChanged('version'));

  form: UntypedFormGroup = this.fb.group({
    terms: [null, GovukValidators.required('You should accept terms and conditions to proceed')],
  });

  submitTerms(): void {
    if (this.form.valid) {
      this.latestTerms$
        .pipe(
          switchMap((terms) => {
            return this.termsAndConditionsService.editUserTerms({ version: terms.version });
          }),
          switchMap(() => this.authService.loadUserTerms()),
        )
        .subscribe(() => this.router.navigate(['']));
    }
  }
}
