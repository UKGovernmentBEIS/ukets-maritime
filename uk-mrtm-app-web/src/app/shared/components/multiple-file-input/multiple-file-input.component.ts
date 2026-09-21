import { Component, computed, effect, ElementRef, inject, input, signal, untracked, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { filter, scan } from 'rxjs';

import { ButtonDirective, FormService, SafeHtmlPipe } from '@netz/govuk-components';

import { FileUploadListComponent } from '@shared/components';
import { FileUploadService } from '@shared/services';
import { FileUpload, FileUploadEvent } from '@shared/types';

type UploadState = Partial<Pick<FileUploadEvent, 'progress' | 'uuid' | 'errors'>>;

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'mrtm-multiple-file-input[baseDownloadUrl]',
  imports: [FileUploadListComponent, SafeHtmlPipe, ButtonDirective],
  standalone: true,
  templateUrl: './multiple-file-input.component.html',
  styleUrl: './multiple-file-input.component.scss',
})
export class MultipleFileInputComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true })!;
  private readonly formService = inject(FormService);
  private readonly fileUploadService = inject(FileUploadService);

  readonly headerSize = input<'m' | 's'>('m');
  readonly listTitle = input<string>();
  readonly label = input('Upload a file');
  readonly hint = input<string>();
  readonly accepted = input('*/*');
  readonly uploadStatusText = input('Uploading files, please wait');
  readonly dropzoneHintText = input('Drag and drop files here or');
  readonly dropzoneButtonText = input('Choose files');
  readonly baseDownloadUrl = input<string>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('input');

  readonly isDraggedOver = signal(false);
  readonly isDisabled = signal(false);
  /** Announced to assistive technology once files are dropped, while they upload. */
  readonly liveStatusText = signal('');

  /** The control's value: every selected file, carrying its uuid once uploaded. */
  private readonly value = signal<FileUpload[]>([]);

  /**
   * What the upload service has reported so far for each selected file: progress, the uuid once uploaded, or the
   * reason it was not uploaded. Events are folded as they arrive, so none is lost between two renders.
   */
  private readonly uploads = toSignal(
    this.fileUploadService.uploadProgress$.pipe(
      filter((uploadEvent) => this.value().some(({ file }) => file === uploadEvent.file)),
      scan(
        (uploads, { file, ...upload }) => new Map(uploads).set(file, { ...uploads.get(file), ...upload }),
        new Map<File, UploadState>(),
      ),
    ),
    { initialValue: new Map<File, UploadState>() },
  );

  readonly uploadedFiles = computed<FileUploadEvent[]>(() => {
    const uploads = this.uploads();

    return this.value().map((selected) => {
      const upload = uploads.get(selected.file);
      const uuid = selected.uuid ?? upload?.uuid;

      return {
        progress: null,
        ...selected,
        ...upload,
        ...(uuid && { downloadUrl: `${this.baseDownloadUrl()}${uuid}` }),
        errors: upload?.errors ?? null,
      };
    });
  });

  private onChange: (value: FileUpload[]) => void = () => undefined;
  private onBlur: () => void = () => undefined;

  constructor() {
    this.ngControl.valueAccessor = this;

    // Once a file is uploaded its uuid has to become part of the form value, which is the one thing the form cannot
    // derive on its own.
    effect(() => {
      const uploads = this.uploads();
      const value = untracked(this.value);

      if (value.some((selected) => !selected.uuid && uploads.get(selected.file)?.uuid)) {
        untracked(() =>
          this.onChange(
            value.map((selected) => ({ ...selected, uuid: selected.uuid ?? uploads.get(selected.file)?.uuid })),
          ),
        );
      }
    });
  }

  get id(): string {
    return this.formService.getControlIdentifier(this.ngControl);
  }

  get describedBy(): string {
    return [this.hint() && `${this.id}-hint`, `${this.id}-hint-file-size`].filter(Boolean).join(' ');
  }

  registerOnChange(onChange: (value: FileUpload[]) => void): void {
    this.onChange = (value) => {
      this.value.set(value);
      onChange(value);
    };
  }

  registerOnTouched(onBlur: () => void): void {
    this.onBlur = onBlur;
  }

  writeValue(value: FileUploadEvent[]): void {
    this.value.set(value ?? []);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onFileChange(event: Event): void {
    const files = (event?.target as HTMLInputElement)?.files;
    this.uploadFiles(files);
    this.fileInput().nativeElement.value = null;
    this.onBlur();
  }

  onChooseFilesClick(): void {
    this.fileInput().nativeElement.click();
  }

  onChooseFilesBlur(): void {
    this.onBlur();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (!this.isDisabled()) {
      this.isDraggedOver.set(true);
    }
  }

  onDragLeave(): void {
    this.isDraggedOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggedOver.set(false);

    if (!this.isDisabled()) {
      this.liveStatusText.set(this.uploadStatusText());
      this.uploadFiles(event.dataTransfer.files);
    }
  }

  onFileDeleteClick(deletedIndex: number): void {
    this.onChange(this.value().filter((_, index) => index !== deletedIndex));
  }

  private uploadFiles(files: FileList): void {
    this.onChange(this.value().concat(Array.from(files).map((file) => ({ file }))));
  }
}
