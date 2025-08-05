import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { EmpShipEmissions } from '@mrtm/api';

import {
  ButtonDirective,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-measurements-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    ButtonDirective,
  ],
  templateUrl: './measurements-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementsSummaryTemplateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @Input({ required: true }) data: EmpShipEmissions['measurements'];
  @Input() changeLink: string;
  @Input() isEditable: boolean = false;
  @Input() queryParams: Params = {};

  public handleAddAnother(): void {
    this.router.navigate(['./', this.changeLink], { relativeTo: this.route, queryParams: this.queryParams });
  }
}
