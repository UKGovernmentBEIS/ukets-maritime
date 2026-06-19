import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { EmpFuelsAndEmissionsFactors, EmpShipEmissions } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { FuelsAndEmissionFactorsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-fuels-and-emission-factors-list-summary-template',
  imports: [ButtonDirective, FuelsAndEmissionFactorsSummaryTemplateComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './fuels-and-emission-factors-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelsAndEmissionFactorsListSummaryTemplateComponent {
  readonly data = input.required<EmpShipEmissions['fuelsAndEmissionsFactors']>();
  readonly changeLinkList = input<string>();
  readonly changeLinkForm = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});
  readonly delete = output<EmpFuelsAndEmissionsFactors>();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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
