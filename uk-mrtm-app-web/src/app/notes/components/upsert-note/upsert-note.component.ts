import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';

import { MrtmAccountViewDTO, NotePayload, UserStateDTO } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  ButtonDirective,
  ErrorSummaryComponent,
  GovukValidators,
  TagComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { OperatorAccountsStatusColorPipe } from '@accounts/pipes';
import { OperatorAccountsStore, selectAccount } from '@accounts/store';
import { NotesService } from '@notes/services';
import { createCommonFileAsyncValidators, MultipleFileInputComponent } from '@shared/components';
import { FileUploadService } from '@shared/services';

interface ViewModel {
  accountInfo: MrtmAccountViewDTO;
  userRoleType: UserStateDTO['roleType'];
  isAccountEditable: boolean;
}

@Component({
  selector: 'mrtm-upsert-note',
  templateUrl: './upsert-note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ErrorSummaryComponent,
    PageHeadingComponent,
    ReactiveFormsModule,
    AsyncPipe,
    TextareaComponent,
    MultipleFileInputComponent,
    ButtonDirective,
    PendingButtonDirective,
    TitleCasePipe,
    OperatorAccountsStatusColorPipe,
    TagComponent,
  ],
})
export class UpsertNoteComponent implements OnInit {
  protected readonly fb: UntypedFormBuilder = inject(UntypedFormBuilder);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly fileUploadService: FileUploadService = inject(FileUploadService);
  private readonly notesService: NotesService = inject(NotesService);
  private readonly authStore: AuthStore = inject(AuthStore);
  private readonly store: OperatorAccountsStore = inject(OperatorAccountsStore);

  readonly vm$: Observable<ViewModel> = this.store.pipe(
    selectAccount,
    combineLatestWith(this.authStore.rxSelect(selectUserRoleType)),
    map(([accountInfo, userRoleType]) => ({
      accountInfo,
      userRoleType,
      isAccountEditable: accountInfo?.status !== 'CLOSED' && userRoleType === 'REGULATOR',
    })),
  );

  isErrorSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  accountId = this.route.snapshot.paramMap.get('accountId');
  workflowId = this.route.snapshot.paramMap.get('workflowId');
  noteId = +this.route.snapshot.paramMap.get('noteId');
  notePayload$: Observable<NotePayload> = this.notesService.getNotePayload(this.workflowId, this.noteId);
  downloadUrl = this.notesService.getDownloadBaseUrl(this.accountId, this.workflowId);

  form = this.fb.group({
    note: [
      '',
      [GovukValidators.required('Enter a note'), GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
    ],
    files: this.fb.control(
      {
        value: [],
        disabled: false,
      },
      {
        asyncValidators: [
          ...createCommonFileAsyncValidators(false),
          this.fileUploadService.uploadMany((file) =>
            this.notesService.uploadNoteFile(+this.accountId, this.workflowId, file),
          ),
        ],
        updateOn: 'change',
      },
    ),
  });

  ngOnInit(): void {
    this.notePayload$.subscribe((payload) => {
      this.form.patchValue({
        note: payload?.note,
        files: this.transformFiles(payload?.files),
      });
    });
  }

  transformFiles(transformedFiles: NotePayload['files']) {
    return transformedFiles
      ? Object.entries(transformedFiles).map((keyValue) => ({
          uuid: keyValue[0],
          file: {
            name: keyValue[1],
          },
        }))
      : [];
  }

  onSubmit() {
    if (this.form.valid) {
      const note = this.form.get('note').value;
      const files = this.form.get('files').value?.map((file) => file.uuid);
      this.notesService.upsertNote(+this.accountId, this.workflowId, this.noteId, note, files).subscribe(() => {
        this.navigateToPreviousRoute();
      });
    } else {
      this.isErrorSummaryDisplayed$.next(true);
    }
  }

  private navigateToPreviousRoute() {
    this.router.navigate([this.noteId ? '../../../' : '../../'], {
      relativeTo: this.route,
      fragment: 'notes',
    });
  }
}
