import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { EmpFuelsAndEmissionsFactors, EmpShipEmissions } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { FuelsAndEmissionFactorsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-fuels-and-emission-factors-list-summary-template',
  standalone: true,
  imports: [ButtonDirective, FuelsAndEmissionFactorsSummaryTemplateComponent, RouterLink, LinkDirective],
  templateUrl: './fuels-and-emission-factors-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelsAndEmissionFactorsListSummaryTemplateComponent {
  @Input({ required: true }) readonly data: EmpShipEmissions['fuelsAndEmissionsFactors'];
  @Input() readonly changeLinkList: string;
  @Input() readonly changeLinkForm: string;
  @Input() readonly isEditable: boolean = false;
  @Input() readonly queryParams: Params = {};
  @Output() readonly delete = new EventEmitter<EmpFuelsAndEmissionsFactors>();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  handleAddAnother(): void {
    this.router.navigate(['./', this.changeLinkForm, crypto.randomUUID()], {
      relativeTo: this.route,
      queryParams: this.queryParams,
    });
  }

  onDeleteFuelEmission(fuel: EmpFuelsAndEmissionsFactors) {
    this.delete.emit(fuel);
  }
}
