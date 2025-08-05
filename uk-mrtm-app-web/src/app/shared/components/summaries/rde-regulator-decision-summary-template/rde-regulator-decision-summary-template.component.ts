import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components/summary-download-files/summary-download-files.component';
import { NotProvidedDirective } from '@shared/directives';
import { RdeForceDecision } from '@shared/types';

@Component({
  selector: 'mrtm-rde-regulator-decision-summary-template',
  standalone: true,
  imports: [
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryListComponent,
    SummaryDownloadFilesComponent,
    TitleCasePipe,
  ],
  templateUrl: './rde-regulator-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeRegulatorDecisionSummaryTemplateComponent {
  data = input.required<RdeForceDecision>();
}
