import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { EmpEmissionsSources, EmpShipEmissions } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emissions-sources-and-fuel-types-used-list-summary-template',
  standalone: true,
  imports: [EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent, ButtonDirective, LinkDirective, RouterLink],
  templateUrl: './emissions-sources-and-fuel-types-used-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionsSourcesAndFuelTypesUsedListSummaryTemplateComponent {
  @Input({ required: true }) readonly data: EmpShipEmissions['emissionsSources'];
  @Input() readonly changeLinkForm: string;
  @Input() readonly changeLinkList: string;
  @Input() readonly isEditable: boolean = false;
  @Input() readonly queryParams: Params = {};
  @Output() readonly delete = new EventEmitter<EmpEmissionsSources>();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  handleAddAnother(): void {
    this.router.navigate(['./', this.changeLinkForm, crypto.randomUUID()], {
      relativeTo: this.route,
      queryParams: this.queryParams,
    });
  }

  onDeleteEmissionSource(emission: EmpEmissionsSources) {
    this.delete.emit(emission);
  }
}
