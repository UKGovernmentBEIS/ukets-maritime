import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
import { NotProvidedDirective } from '@shared/directives';
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
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './fuels-and-emission-factors-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelsAndEmissionFactorsSummaryTemplateComponent {
  public readonly densityMethodBunkerOptions = DENSITY_METHOD_BUNKER_SELECT_ITEMS;
  public readonly densityMethodTankOptions = DENSITY_METHOD_TANK_SELECT_ITEMS;

  public readonly index = input.required<number>();
  public readonly data = input.required<EmpFuelsAndEmissionsFactors>();
  public readonly changeLink = input<string>('../');
  public readonly isEditable = input<boolean>(false);
  public readonly isDeletable = input<boolean>(false);
  public readonly queryParams = input<Params>({ change: true });
  public readonly delete = output<EmpFuelsAndEmissionsFactors>();

  public handleRemove(event: Event): void {
    event.preventDefault();
    this.delete.emit(this.data());
  }
}
