import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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

import { NotProvidedDirective } from '@shared/directives';

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
  ],
  standalone: true,
  templateUrl: './measurements-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementsSummaryTemplateComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly data = input.required<EmpShipEmissions['measurements']>();
  readonly changeLink = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});

  public handleAddAnother(): void {
    this.router.navigate(['./', this.changeLink()], { relativeTo: this.route, queryParams: this.queryParams() });
  }
}
