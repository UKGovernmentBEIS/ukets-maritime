import { KeyValuePipe, NgTemplateOutlet, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { FileUploadEvent } from '@shared/types';

@Component({
  selector: 'mrtm-file-upload-list',
  templateUrl: './file-upload-list.component.html',
  styleUrl: '../multiple-file-input/multiple-file-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgTemplateOutlet, ButtonDirective, LinkDirective, RouterLink, PercentPipe, KeyValuePipe],
})
export class FileUploadListComponent {
  @Input() headerSize: 'm' | 's' = 'm';
  @Input() listTitle: string;
  @Input() files: FileUploadEvent[] = [];
  @Input() isDisabled = false;
  @Input() showNoFilesHint = true;
  @Output() readonly fileDelete = new EventEmitter<number>();
}
