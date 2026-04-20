import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { OperatorImprovementResponse } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { BooleanToTextPipe } from '@shared/pipes';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-vir-operator-response-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    BooleanToTextPipe,
    GovukDatePipe,
    RouterLink,
    LinkDirective,
    SummaryDownloadFilesComponent,
  ],
  templateUrl: './vir-operator-response-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirOperatorResponseSummaryTemplateComponent {
  public readonly header = input<string>();
  public readonly data = input<Omit<OperatorImprovementResponse, 'files'> & { files?: AttachedFile[] }>();
  public readonly isEditable = input<boolean>(false);
  public readonly queryParams = input<Params>({});
  public readonly wizardStep = input<{ [s: string]: string }>({});
}
