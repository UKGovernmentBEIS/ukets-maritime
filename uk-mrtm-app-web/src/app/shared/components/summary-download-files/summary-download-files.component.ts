import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';
import { AttachedFile } from '@shared/types';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-summary-download-files',
  imports: [LinkDirective, RouterLink, HtmlDiffDirective],
  standalone: true,
  template: `
    @for (file of combinedFiles(); track file) {
      <!-- eslint-disable-next-line @angular-eslint/template/elements-content-->
      <a
        [routerLink]="file?.current?.downloadUrl"
        govukLink
        target="_blank"
        htmlDiff
        [isFiles]="true"
        [current]="file?.current?.fileName"
        [previous]="file?.previous?.fileName"></a>
      @if (!$last && combinedFiles()?.length > 1) {
        <br />
      }
    } @empty {
      <span class="govuk-hint">Not provided</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryDownloadFilesComponent {
  readonly files = input.required<AttachedFile[]>();
  readonly originalFiles = input<AttachedFile[]>(null);

  readonly combinedFiles = computed(() => mergeDiffArray<AttachedFile>(this.files(), this.originalFiles()));
}
