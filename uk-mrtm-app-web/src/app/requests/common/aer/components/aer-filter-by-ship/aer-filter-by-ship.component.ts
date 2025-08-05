import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ButtonDirective, GovukSelectOption, SelectComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-aer-filter-by-ship',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonDirective, SelectComponent],
  templateUrl: './aer-filter-by-ship.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerFilterByShipComponent {
  public readonly items: InputSignal<Array<GovukSelectOption>> = input<Array<GovukSelectOption>>();
  public readonly header: InputSignal<string> = input<string>();
  public readonly filterChanged: OutputEmitterRef<any> = output<any>();
  public readonly formGroup: UntypedFormGroup = new UntypedFormGroup({
    filterByShip: new UntypedFormControl(null),
  });

  public onFilter(): void {
    this.filterChanged.emit(this.formGroup?.value?.filterByShip);
  }
}
