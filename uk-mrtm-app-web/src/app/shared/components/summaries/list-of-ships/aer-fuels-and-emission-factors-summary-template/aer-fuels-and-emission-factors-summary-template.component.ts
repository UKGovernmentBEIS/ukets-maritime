import { ChangeDetectionStrategy, Component, computed, input, output, Signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukTableColumn, LinkDirective, TableComponent } from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { FuelOriginTitlePipe } from '@shared/pipes';
import { FuelsAndEmissionsFactors } from '@shared/types';

@Component({
  selector: 'mrtm-aer-fuels-and-emission-factors-summary-template',
  standalone: true,
  imports: [RouterLink, FuelOriginTitlePipe, NotProvidedDirective, TableComponent, LinkDirective],
  templateUrl: './aer-fuels-and-emission-factors-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerFuelsAndEmissionFactorsSummaryTemplateComponent {
  readonly data = input.required<FuelsAndEmissionsFactors[]>();
  readonly changeLink = input<string>('../');
  readonly isEditable = input<boolean>(false);
  readonly isDeletable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });
  readonly delete = output<FuelsAndEmissionsFactors>();

  private readonly mainColumns: GovukTableColumn[] = [
    { field: 'origin', header: 'Fuel origin', widthClass: 'app-column-width-15-per' },
    {
      field: 'carbonDioxide',
      header: 'Tank to Wake emission factor for carbon dioxide',
      isNumeric: true,
      widthClass: 'app-column-width-20-per',
    },
    {
      field: 'methane',
      header: 'Tank to Wake emission factor for methane',
      isNumeric: true,
      widthClass: 'app-column-width-20-per',
    },
    {
      field: 'nitrousOxide',
      header: 'Tank to Wake emission factor for nitrous oxide',
      isNumeric: true,
      widthClass: 'app-column-width-20-per',
    },
  ];
  readonly columns: Signal<GovukTableColumn[]> = computed(() =>
    this.isEditable()
      ? [
          ...this.mainColumns,
          { field: 'actionLinks', header: 'Actions', hiddenHeader: true, widthClass: 'app-column-width-15-per' },
        ]
      : this.mainColumns,
  );

  handleRemove(event: Event, item: FuelsAndEmissionsFactors): void {
    event.preventDefault();
    this.delete.emit(item);
  }
}
