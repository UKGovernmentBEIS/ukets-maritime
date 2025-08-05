import { ChangeDetectorRef, Directive, inject, OnInit } from '@angular/core';

import { distinctUntilChanged, takeUntil } from 'rxjs';

import { DestroySubject } from '@netz/common/services';
import { TextInputComponent } from '@netz/govuk-components';

@Directive({
  selector: 'govuk-text-input[mrtmAsyncValidationField],[govuk-text-input][netzAsyncValidationField]',
  providers: [DestroySubject],
  standalone: true,
})
export class AsyncValidationFieldDirective implements OnInit {
  private readonly textInputComponent = inject(TextInputComponent);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly destroy$ = inject(DestroySubject);

  ngOnInit(): void {
    this.textInputComponent.control.statusChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (previousState, currentState) => previousState === currentState && previousState !== 'PENDING',
        ),
      )
      .subscribe(() => this.cdRef.markForCheck());
  }
}
