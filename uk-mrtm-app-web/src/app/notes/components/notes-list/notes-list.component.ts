import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { AccountNoteDto } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  LinkDirective,
  PaginationComponent,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotesService } from '@notes/services';
import { NoteResponseUnion } from '@notes/types';
import { MoreLessComponent, SummaryDownloadFilesComponent } from '@shared/components';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-notes-list',
  imports: [
    GovukDatePipe,
    MoreLessComponent,
    PaginationComponent,
    RouterLink,
    ButtonDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowValueDirective,
    SummaryDownloadFilesComponent,
    SummaryListRowActionsDirective,
    LinkDirective,
    AsyncPipe,
  ],
  standalone: true,
  templateUrl: './notes-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesListComponent {
  private readonly notesService: NotesService = inject(NotesService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  accountId = +this.route.snapshot.paramMap.get('accountId');
  workflowId = this.route.snapshot.paramMap.get('workflowId');
  readonly pageSize = 10;
  page$ = new BehaviorSubject<number>(1);
  notes$: Observable<NoteResponseUnion> = this.notesService.getNotes(
    this.accountId,
    this.workflowId,
    this.pageSize,
    this.page$,
  );

  getDownloadUrlFiles(note: AccountNoteDto): AttachedFile[] {
    const files = note.payload.files || {};

    return (
      Object.keys(files)?.map((uuid) => ({
        downloadUrl: `./file-download/${uuid}`,
        fileName: files[uuid],
      })) ?? []
    );
  }
}
