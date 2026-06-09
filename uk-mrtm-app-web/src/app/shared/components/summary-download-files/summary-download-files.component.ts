import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

import { HTML_DIFF } from '@shared/directives';
import { AttachedFile } from '@shared/types';
import { isNullOrEmpty, mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-summary-download-files',
  imports: [LinkDirective, RouterLink, NgTemplateOutlet],
  standalone: true,
  templateUrl: './summary-download-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryDownloadFilesComponent {
  readonly htmlDiffProvider: boolean = inject(HTML_DIFF, { optional: true });

  readonly files = input.required<AttachedFile[]>();
  readonly originalFiles = input<AttachedFile[]>(null);

  readonly combinedFiles = computed(() => mergeDiffArray<AttachedFile>(this.files(), this.originalFiles()));

  protected readonly isNullOrEmpty = isNullOrEmpty;
}
