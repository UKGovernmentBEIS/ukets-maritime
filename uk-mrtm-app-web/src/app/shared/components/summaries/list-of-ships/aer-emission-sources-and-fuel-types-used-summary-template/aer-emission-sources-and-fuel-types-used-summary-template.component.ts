import { ChangeDetectionStrategy, Component, computed, input, output, Signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmissionsSources } from '@mrtm/api';

import { GovukTableColumn, LinkDirective, TableComponent } from '@netz/govuk-components';

import {
  EMISSION_SOURCES_SOURCE_CLASS_SELECT_ITEMS,
  EMISSION_SOURCES_TYPE_SELECT_ITEMS,
  monitoringMethodMap,
} from '@shared/constants';
import { NotProvidedDirective, ScrollablePaneDirective } from '@shared/directives';
import { FuelOriginTitlePipe, SelectOptionToTitlePipe } from '@shared/pipes';
import { MethaneSlipValuePipe } from '@shared/pipes/methane-slip-value.pipe';
import { WithNeedsReview } from '@shared/types';

@Component({
  selector: 'mrtm-aer-emission-sources-and-fuel-types-used-summary-template',
  standalone: true,
  imports: [
    RouterLink,
    FuelOriginTitlePipe,
    SelectOptionToTitlePipe,
    NotProvidedDirective,
    TableComponent,
    LinkDirective,
    MethaneSlipValuePipe,
    ScrollablePaneDirective,
  ],
  templateUrl: './aer-emission-sources-and-fuel-types-used-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerEmissionSourcesAndFuelTypesUsedSummaryTemplateComponent {
  readonly typeOptions = EMISSION_SOURCES_TYPE_SELECT_ITEMS;
  readonly sourceClassOptions = EMISSION_SOURCES_SOURCE_CLASS_SELECT_ITEMS;
  readonly monitoringMethodMap = monitoringMethodMap;

  readonly data = input.required<WithNeedsReview<EmissionsSources>[]>();
  readonly changeLink = input<string>('../');
  readonly isEditable = input<boolean>(false);
  readonly isDeletable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly delete = output<EmissionsSources>();

  private readonly mainColumns: GovukTableColumn[] = [
    { field: 'name', header: 'Unique emission source name', widthClass: 'app-column-width-15-per' },
    { field: 'type', header: 'Emission source type' },
    { field: 'sourceClass', header: 'Emission source class' },
    { field: 'fuelDetails', header: 'Potential fuel types used' },
    { field: 'monitoringMethod', header: 'Monitoring methods' },
  ];
  readonly columns: Signal<GovukTableColumn[]> = computed(() =>
    this.isEditable()
      ? [...this.mainColumns, { field: 'actionLinks', header: 'Actions', hiddenHeader: true }]
      : this.mainColumns,
  );

  getSortedMonitoringMethods(item: EmissionsSources): EmissionsSources['monitoringMethod'] {
    return [...(item?.monitoringMethod ?? [])].sort((a, b) =>
      monitoringMethodMap?.[a]?.text?.localeCompare(monitoringMethodMap?.[b]?.text),
    );
  }

  handleRemove(event: Event, item: EmissionsSources): void {
    event.preventDefault();
    this.delete.emit(item);
  }

  public onDefineRowAdditionalStyle(item: WithNeedsReview<EmissionsSources>): string | string[] | undefined {
    return item?.needsReview ? 'needs-review' : undefined;
  }
}
