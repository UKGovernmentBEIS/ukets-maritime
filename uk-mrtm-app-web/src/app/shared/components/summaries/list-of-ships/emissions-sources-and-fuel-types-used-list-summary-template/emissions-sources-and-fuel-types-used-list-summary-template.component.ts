import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { EmpEmissionsSources, EmpShipEmissions } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emissions-sources-and-fuel-types-used-list-summary-template',
  imports: [EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent, ButtonDirective, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './emissions-sources-and-fuel-types-used-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionsSourcesAndFuelTypesUsedListSummaryTemplateComponent {
  readonly data = input.required<EmpShipEmissions['emissionsSources']>();
  readonly changeLinkForm = input<string>();
  readonly changeLinkList = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});
  readonly delete = output<EmpEmissionsSources>();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  handleAddAnother(): void {
    this.router.navigate(['./', this.changeLinkForm(), crypto.randomUUID()], {
      relativeTo: this.route,
      queryParams: this.queryParams(),
    });
  }

  onDeleteEmissionSource(emission: EmpEmissionsSources) {
    this.delete.emit(emission);
  }
}
