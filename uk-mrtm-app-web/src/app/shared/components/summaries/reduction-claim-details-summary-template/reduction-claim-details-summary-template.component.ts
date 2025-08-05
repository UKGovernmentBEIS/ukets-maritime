import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, TableComponent } from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { provideReductionClaimDetailsSummaryColumns } from '@shared/components/summaries/reduction-claim-details-summary-template/reduction-claim-details-summary-template.consts';
import { BigNumberPipe, FuelOriginTitlePipe } from '@shared/pipes';
import { ReductionClaimDetailsListItemDto } from '@shared/types';

@Component({
  selector: 'mrtm-reduction-claim-details-summary-template',
  standalone: true,
  imports: [
    TableComponent,
    FuelOriginTitlePipe,
    BigNumberPipe,
    SummaryDownloadFilesComponent,
    LinkDirective,
    RouterLink,
  ],
  templateUrl: './reduction-claim-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimDetailsSummaryTemplateComponent {
  public readonly editable = input<boolean>(false);
  public readonly data = input<Array<ReductionClaimDetailsListItemDto>>();
  public readonly columns = computed(() => provideReductionClaimDetailsSummaryColumns(this.editable()));
  public readonly handleChange = output<ReductionClaimDetailsListItemDto>();
  public readonly handleDelete = output<ReductionClaimDetailsListItemDto>();

  public onDelete(event: Event, item: ReductionClaimDetailsListItemDto): void {
    event.preventDefault();
    this.handleDelete.emit(item);
  }

  public onChange(event: Event, item: ReductionClaimDetailsListItemDto): void {
    event.preventDefault();
    this.handleChange.emit(item);
  }
}
