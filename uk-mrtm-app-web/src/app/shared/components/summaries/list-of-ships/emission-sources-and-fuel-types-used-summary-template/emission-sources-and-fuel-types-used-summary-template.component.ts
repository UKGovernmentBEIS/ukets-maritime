import { ChangeDetectionStrategy, Component, computed, input, output, Signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { isNil } from 'lodash-es';

import { EmpEmissionsSources } from '@mrtm/api';

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
import { NotProvidedDirective } from '@shared/directives';
import { FuelOriginTitlePipe, SelectOptionToTitlePipe } from '@shared/pipes';
import { WithNeedsReview } from '@shared/types';

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
  ],
  standalone: true,
  templateUrl: './emission-sources-and-fuel-types-used-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent {
  public readonly typeOptions = EMISSION_SOURCES_TYPE_SELECT_ITEMS;
  public readonly sourceClassOptions = EMISSION_SOURCES_SOURCE_CLASS_SELECT_ITEMS;
  public readonly monitoringMethodMap = monitoringMethodMap;

  public readonly index = input.required<number>();
  public readonly data = input.required<WithNeedsReview<EmpEmissionsSources>>();
  public readonly changeLink = input<string>('../');
  public readonly isEditable = input<boolean>(false);
  public readonly isDeletable = input<boolean>(false);
  public readonly queryParams = input<Params>({ change: true });

  public readonly delete = output<EmpEmissionsSources>();

  public readonly sortedMonitoringMethods: Signal<EmpEmissionsSources['monitoringMethod']> = computed(() => {
    const mutableMonitoringMethods = [...(this.data()?.monitoringMethod ?? [])];
    return mutableMonitoringMethods?.sort((a, b) =>
      monitoringMethodMap?.[a]?.text?.localeCompare(monitoringMethodMap?.[b]?.text),
    );
  });

  public handleRemove(event: Event): void {
    event.preventDefault();
    this.delete.emit(this.data());
  }

  protected readonly isNil = isNil;
}
