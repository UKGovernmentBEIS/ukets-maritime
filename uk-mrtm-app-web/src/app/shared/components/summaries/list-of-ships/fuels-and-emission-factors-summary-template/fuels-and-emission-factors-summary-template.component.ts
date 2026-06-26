import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpFuelsAndEmissionsFactors } from '@mrtm/api';

import {
  LinkDirective,
  SummaryCardComponent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { DENSITY_METHOD_BUNKER_SELECT_ITEMS, DENSITY_METHOD_TANK_SELECT_ITEMS } from '@shared/constants';
import { HTML_DIFF, HtmlDiffDirective } from '@shared/directives';
import { HtmlDiffService } from '@shared/directives/html-diff/html-diff.service';
import { FuelOriginTitlePipe, SelectOptionToTitlePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-fuels-and-emission-factors-summary-template',
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
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './fuels-and-emission-factors-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelsAndEmissionFactorsSummaryTemplateComponent {
  private readonly hasHtmlDiff = inject(HTML_DIFF, { optional: true });
  private readonly diffService = inject(HtmlDiffService);

  readonly index = input.required<number>();
  readonly fuelEmissionsFactor = input.required<EmpFuelsAndEmissionsFactors>();
  readonly originalFuelEmissionsFactor = input<EmpFuelsAndEmissionsFactors>();
  readonly changeLink = input<string>('../');
  readonly isEditable = input<boolean>(false);
  readonly isDeletable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly delete = output<EmpFuelsAndEmissionsFactors>();

  readonly cardTitle = computed(() => {
    const currentTitle = this.fuelEmissionsFactor() ? `Fuel ${this.index() + 1}` : null;
    const previousTitle = this.originalFuelEmissionsFactor() ? `Fuel ${this.index() + 1}` : null;

    if (this.hasHtmlDiff) {
      return this.diffService.singleTokenDiff(previousTitle, currentTitle);
    }

    return currentTitle;
  });

  readonly densityMethodBunkerOptions = DENSITY_METHOD_BUNKER_SELECT_ITEMS;
  readonly densityMethodTankOptions = DENSITY_METHOD_TANK_SELECT_ITEMS;

  handleRemove(event: Event): void {
    event.preventDefault();
    this.delete.emit(this.fuelEmissionsFactor());
  }
}
