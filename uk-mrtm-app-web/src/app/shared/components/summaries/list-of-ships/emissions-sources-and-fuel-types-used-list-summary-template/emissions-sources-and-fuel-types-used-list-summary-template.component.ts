import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { EmpEmissionsSources } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent } from '@shared/components';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-emissions-sources-and-fuel-types-used-list-summary-template',
  imports: [EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent, ButtonDirective, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './emissions-sources-and-fuel-types-used-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionsSourcesAndFuelTypesUsedListSummaryTemplateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly emissionSources = input.required<EmpEmissionsSources[]>();
  readonly originalEmissionSources = input<EmpEmissionsSources[]>();
  readonly changeLinkForm = input<string>();
  readonly changeLinkList = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});

  readonly delete = output<EmpEmissionsSources>();

  readonly combinedFuelsEmissionSources = computed(() =>
    mergeDiffArray<EmpEmissionsSources>(this.emissionSources(), this.originalEmissionSources()),
  );

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
