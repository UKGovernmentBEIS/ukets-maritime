import { KeyValuePipe, NgTemplateOutlet, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { FileUploadEvent } from '@shared/types';

@Component({
  selector: 'mrtm-file-upload-list',
  imports: [NgTemplateOutlet, ButtonDirective, LinkDirective, RouterLink, PercentPipe, KeyValuePipe],
  standalone: true,
  templateUrl: './file-upload-list.component.html',
  styleUrl: '../multiple-file-input/multiple-file-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadListComponent {
  readonly headerSize = input<'m' | 's'>('m');
  readonly listTitle = input<string>();
  readonly files = input<FileUploadEvent[]>([]);
  readonly isDisabled = input(false);
  readonly showNoFilesHint = input(true);
  readonly fileDelete = output<number>();
}
