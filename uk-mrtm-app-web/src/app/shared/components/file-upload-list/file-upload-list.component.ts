import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
} from '@netz/govuk-components';

import { FileUploadEvent } from '@shared/types';

@Component({
  selector: 'mrtm-file-upload-list',
  imports: [
    LinkDirective,
    RouterLink,
    KeyValuePipe,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
  ],
  standalone: true,
  templateUrl: './file-upload-list.component.html',
  styleUrl: './file-upload-list.component.scss',
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
