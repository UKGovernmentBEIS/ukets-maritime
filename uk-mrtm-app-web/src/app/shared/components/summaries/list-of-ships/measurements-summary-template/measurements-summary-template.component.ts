import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { MeasurementDescription } from '@mrtm/api';

import {
  ButtonDirective,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { monitoringMethodMap } from '@shared/constants';
import { HtmlDiffDirective, NotProvidedDirective } from '@shared/directives';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-measurements-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    ButtonDirective,
    NotProvidedDirective,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './measurements-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementsSummaryTemplateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly measurements = input.required<MeasurementDescription[]>();
  readonly originalMeasurements = input<MeasurementDescription[]>();
  readonly changeLink = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});

  readonly combinedMeasurements = computed(() =>
    mergeDiffArray<MeasurementDescription>(this.measurements(), this.originalMeasurements()),
  );

  protected readonly monitoringMethodMap = monitoringMethodMap;

  combinedEmissionSources(emissionSources: string[], originalEmissionSources: string[]) {
    return mergeDiffArray<string>(emissionSources, originalEmissionSources);
  }

  handleAddAnother(): void {
    this.router.navigate(['./', this.changeLink()], { relativeTo: this.route, queryParams: this.queryParams() });
  }
}
