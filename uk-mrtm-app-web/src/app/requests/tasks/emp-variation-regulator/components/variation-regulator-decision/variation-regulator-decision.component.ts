import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, FieldsetDirective, LegendDirective, TextareaComponent } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { createAnotherScheduleItem } from '@requests/tasks/emp-variation-regulator/components/variation-regulator-decision/variation-regulator-decision.form-provider';
import { VARIATION_REGULATOR_DECISION_FORM } from '@requests/tasks/emp-variation-regulator/components/variation-regulator-decision/variation-regulator-decision-form.token';
import { VariationRegulatorDecisionFormModel } from '@requests/tasks/emp-variation-regulator/components/variation-regulator-decision/variation-regulator-decision-form-model.type';
import { existingControlContainer } from '@shared/providers';

@Component({
  selector: 'mrtm-variation-regulator-decision',
  standalone: true,
  imports: [ButtonDirective, ReactiveFormsModule, TextareaComponent, LegendDirective, FieldsetDirective],
  templateUrl: './variation-regulator-decision.component.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  viewProviders: [existingControlContainer],
})
export class VariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  downloadUrl = this.store.select(empCommonQuery.selectTasksDownloadUrl)();

  get scheduleItemsCtrl() {
    return this.form.controls.variationScheduleItems;
  }

  addAnotherScheduleItem(): void {
    this.scheduleItemsCtrl.push(createAnotherScheduleItem(null));
  }
}
