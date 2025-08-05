import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { StatusTagColorPipe } from '@netz/common/pipes';
import { GovukTableColumn, LinkDirective, TableComponent, TagComponent } from '@netz/govuk-components';

import { LIST_OF_SHIPS_TABLE_COLUMNS } from '@requests/common/components/emissions/list-of-ships-table/list-of-ships-table.constants';
import { ShipTaskStatusPipe, ShipTypePipe } from '@requests/common/components/emissions/pipes';
import { HTML_DIFF, HtmlDiffDirective } from '@shared/directives';
import { DiffItem, ShipEmissionTableListItem } from '@shared/types';
import { mergeDiffShips } from '@shared/utils';

@Component({
  selector: 'mrtm-list-of-ships-summary-template',
  standalone: true,
  imports: [
    TableComponent,
    LinkDirective,
    ShipTaskStatusPipe,
    ShipTypePipe,
    StatusTagColorPipe,
    TagComponent,
    RouterLink,
    HtmlDiffDirective,
  ],
  templateUrl: './list-of-ships-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsSummaryTemplateComponent {
  hasHtmlDiff = inject(HTML_DIFF, { optional: true });
  @Input({ required: true }) data: ShipEmissionTableListItem[] = [];
  @Input() originalShips: ShipEmissionTableListItem[];
  @Input() editUrl: string;
  @Input() queryParams: Params = {};

  columns = LIST_OF_SHIPS_TABLE_COLUMNS as GovukTableColumn<DiffItem<ShipEmissionTableListItem>>[];
  combinedShips: Signal<DiffItem<ShipEmissionTableListItem>[]> = computed(() =>
    mergeDiffShips(this.data, this.originalShips),
  );
}
