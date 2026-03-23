import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TextInputComponent } from '@netz/govuk-components';

import { DataSuppliersStore } from '@data-suppliers/+state';
import { DATA_SUPPLIER_FORM } from '@data-suppliers/data-suppliers.constants';
import { provideDataSuppliersForm } from '@data-suppliers/data-suppliers-form/data-suppliers-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-data-suppliers-form',
  standalone: true,
  imports: [WizardStepComponent, TextInputComponent, ReactiveFormsModule],
  providers: [provideDataSuppliersForm],
  templateUrl: './data-suppliers-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSuppliersFormComponent {
  private readonly store = inject(DataSuppliersStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly formGroup = inject(DATA_SUPPLIER_FORM);

  public onSubmit(): void {
    this.store.setNewItem(this.formGroup.value);
    this.router.navigate(['summary'], { relativeTo: this.activatedRoute });
  }
}
