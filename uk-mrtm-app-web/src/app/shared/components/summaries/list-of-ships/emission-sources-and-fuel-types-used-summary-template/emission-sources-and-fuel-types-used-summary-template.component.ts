import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpEmissionsSources, FuelOriginTypeName } from '@mrtm/api';

import {
  LinkDirective,
  SummaryCardComponent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  EMISSION_SOURCES_SOURCE_CLASS_SELECT_ITEMS,
  EMISSION_SOURCES_TYPE_SELECT_ITEMS,
  monitoringMethodMap,
} from '@shared/constants';
import { HTML_DIFF, HtmlDiffDirective, NotProvidedDirective } from '@shared/directives';
import { HtmlDiffService } from '@shared/directives/html-diff/html-diff.service';
import { FuelOriginTitlePipe, SelectOptionToTitlePipe } from '@shared/pipes';
import { WithNeedsReview } from '@shared/types';
import { isNil, mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-emission-sources-and-fuel-types-used-summary-template',
  imports: [
    SummaryCardComponent,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    FuelOriginTitlePipe,
    SelectOptionToTitlePipe,
    NotProvidedDirective,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './emission-sources-and-fuel-types-used-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent {
  private readonly hasHtmlDiff = inject(HTML_DIFF, { optional: true });
  private readonly diffService = inject(HtmlDiffService);

  readonly index = input.required<number>();
  readonly emissionSource = input.required<WithNeedsReview<EmpEmissionsSources>>();
  readonly originalEmissionSource = input<WithNeedsReview<EmpEmissionsSources>>();
  readonly changeLink = input<string>('../');
  readonly isEditable = input<boolean>(false);
  readonly isDeletable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly delete = output<EmpEmissionsSources>();

  readonly typeOptions = EMISSION_SOURCES_TYPE_SELECT_ITEMS;
  readonly sourceClassOptions = EMISSION_SOURCES_SOURCE_CLASS_SELECT_ITEMS;
  readonly monitoringMethodMap = monitoringMethodMap;
  readonly isNil = isNil;

  readonly combinedFuelDetails = computed(() =>
    mergeDiffArray<FuelOriginTypeName>(this.emissionSource()?.fuelDetails, this.originalEmissionSource()?.fuelDetails),
  );

  readonly combinedSortedMonitoringMethods = computed(() => {
    const mutableCurrentMethods = [...(this.emissionSource()?.monitoringMethod ?? [])];
    mutableCurrentMethods.sort((a, b) =>
      this.monitoringMethodMap?.[a]?.text?.localeCompare(this.monitoringMethodMap?.[b]?.text),
    );
    const mutableOriginalMethods = [...(this.originalEmissionSource()?.monitoringMethod ?? [])];
    mutableOriginalMethods.sort((a, b) =>
      this.monitoringMethodMap?.[a]?.text?.localeCompare(this.monitoringMethodMap?.[b]?.text),
    );

    return mergeDiffArray<string>(mutableCurrentMethods, mutableOriginalMethods);
  });

  readonly cardTitle = computed(() => {
    const currentTitle = this.emissionSource() ? `Emission source ${this.index() + 1}` : null;
    const previousTitle = this.originalEmissionSource() ? `Emission source ${this.index() + 1}` : null;

    if (this.hasHtmlDiff) {
      return this.diffService.singleTokenDiff(previousTitle, currentTitle);
    }

    return currentTitle;
  });

  handleRemove(event: Event): void {
    event.preventDefault();
    this.delete.emit(this.emissionSource());
  }
}
