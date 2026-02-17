import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BehaviorSubject, filter, startWith, take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { ButtonDirective, ErrorSummaryComponent, LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-wizard-step',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    PageHeadingComponent,
    PendingButtonDirective,
    RouterLink,
    ButtonDirective,
    LinkDirective,
    ErrorSummaryComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  standalone: true,
  templateUrl: './wizard-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardStepComponent {
  readonly showBackLink = input(false);
  readonly formGroup = input<UntypedFormGroup>();
  readonly heading = input<string>();
  readonly caption = input<string>();
  readonly submitText = input('Continue');
  readonly hideSubmit = input<boolean>();
  readonly showReturnLink = input(false);
  readonly showCancelLink = input<boolean>(false);
  readonly cancelLinkPath = input<string>();
  readonly isTwoThirds = input<boolean>(false);
  readonly size = input<'l' | 'xl'>('l');
  readonly formSubmit = output<UntypedFormGroup>();

  isSummaryDisplayedSubject = new BehaviorSubject(false);

  onSubmit(): void {
    this.formGroup()
      .statusChanges.pipe(
        startWith(this.formGroup().status),
        filter((status) => status !== 'PENDING'),
        take(1),
      )
      .subscribe((status) => {
        switch (status) {
          case 'VALID':
            this.formSubmit.emit(this.formGroup());
            break;
          case 'INVALID':
            this.formGroup().markAllAsTouched();
            this.isSummaryDisplayedSubject.next(true);
            break;
        }
      });
  }
}
