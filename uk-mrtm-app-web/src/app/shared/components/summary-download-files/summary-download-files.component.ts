import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';
import { AttachedFile } from '@shared/types';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-summary-download-files',
  template: `
    @for (file of combinedFiles(); track file; let isLast = $last) {
      <!-- eslint-disable-next-line @angular-eslint/template/elements-content-->
      <a
        [routerLink]="file?.current?.downloadUrl"
        govukLink
        target="_blank"
        htmlDiff
        [current]="file?.current?.fileName"
        [previous]="file?.previous?.fileName"></a>
      @if (!isLast && files?.length !== 1) {
        <br />
      }
    } @empty {
      <span class="govuk-hint">Not provided</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LinkDirective, RouterLink, HtmlDiffDirective],
})
export class SummaryDownloadFilesComponent {
  @Input({ required: true }) files: AttachedFile[];
  @Input() originalFiles: AttachedFile[];

  combinedFiles = computed(() => mergeDiffArray<AttachedFile>(this.files, this.originalFiles));
}
