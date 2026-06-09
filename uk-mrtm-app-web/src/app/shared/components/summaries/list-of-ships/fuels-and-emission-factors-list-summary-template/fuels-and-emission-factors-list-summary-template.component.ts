import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { EmpFuelsAndEmissionsFactors } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { FuelsAndEmissionFactorsSummaryTemplateComponent } from '@shared/components';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-fuels-and-emission-factors-list-summary-template',
  imports: [ButtonDirective, FuelsAndEmissionFactorsSummaryTemplateComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './fuels-and-emission-factors-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelsAndEmissionFactorsListSummaryTemplateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly fuelsEmissionsFactors = input.required<EmpFuelsAndEmissionsFactors[]>();
  readonly originalFuelsEmissionsFactors = input<EmpFuelsAndEmissionsFactors[]>();
  readonly changeLinkList = input<string>();
  readonly changeLinkForm = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});

  readonly delete = output<EmpFuelsAndEmissionsFactors>();

  readonly combinedFuelsEmissionsFactors = computed(() =>
    mergeDiffArray<EmpFuelsAndEmissionsFactors>(this.fuelsEmissionsFactors(), this.originalFuelsEmissionsFactors()),
  );

  handleAddAnother(): void {
    this.router.navigate(['./', this.changeLinkForm(), crypto.randomUUID()], {
      relativeTo: this.route,
      queryParams: this.queryParams(),
    });
  }

  onDeleteFuelEmission(fuel: EmpFuelsAndEmissionsFactors) {
    this.delete.emit(fuel);
  }
}
