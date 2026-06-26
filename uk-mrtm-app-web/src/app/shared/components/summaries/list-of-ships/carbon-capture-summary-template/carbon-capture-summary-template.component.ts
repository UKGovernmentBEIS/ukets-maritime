import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpCarbonCapture } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { HtmlDiffDirective, NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';
import { AttachedFile } from '@shared/types';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-carbon-capture-summary-template',
  imports: [
    SummaryListComponent,
    LinkDirective,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    BooleanToTextPipe,
    SummaryDownloadFilesComponent,
    HtmlDiffDirective,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './carbon-capture-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonCaptureSummaryTemplateComponent {
  readonly carbonCapture = input.required<EmpCarbonCapture>();
  readonly originalCarbonCapture = input<EmpCarbonCapture>();
  readonly changeLink = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});
  readonly files = input<AttachedFile[]>();
  readonly originalFiles = input<AttachedFile[]>();

  readonly combinedTechnologyEmissionSources = computed(() =>
    mergeDiffArray<string>(
      this.carbonCapture()?.technologies?.technologyEmissionSources,
      this.originalCarbonCapture()?.technologies?.technologyEmissionSources,
    ),
  );
}
