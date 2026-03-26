import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { empVariationRegulatorApprovedQuery } from '@requests/timeline/emp-variation-regulator-approved/+state';
import { EmpVariationReviewedSummaryTemplateComponent } from '@shared/components';
import { EmpReviewedDto } from '@shared/types';

@Component({
  selector: 'mrtm-emp-variation-regulator-approved',
  imports: [EmpVariationReviewedSummaryTemplateComponent],
  standalone: true,
  templateUrl: './emp-variation-regulator-approved.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationRegulatorApprovedComponent {
  private readonly actionStore: RequestActionStore = inject(RequestActionStore);

  public readonly vm: Signal<EmpReviewedDto> = computed(() =>
    this.actionStore.select(empVariationRegulatorApprovedQuery.selectEmpApprovedDTO)(),
  );
}
