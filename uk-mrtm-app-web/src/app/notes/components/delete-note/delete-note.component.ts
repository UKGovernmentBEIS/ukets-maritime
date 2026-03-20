import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { NotesService } from '@notes/services';

@Component({
  selector: 'mrtm-delete-note',
  imports: [PageHeadingComponent, PendingButtonDirective, RouterLink, ButtonDirective, LinkDirective],
  standalone: true,
  templateUrl: './delete-note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteNoteComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly notesService: NotesService = inject(NotesService);

  accountId = this.route.snapshot.paramMap.get('accountId');
  workflowId = this.route.snapshot.paramMap.get('workflowId');
  noteId = +this.route.snapshot.paramMap.get('noteId');
  backUrl = this.notesService.getOriginUrl(this.accountId, this.workflowId);

  onDelete() {
    this.notesService.deleteNote(this.workflowId, this.noteId).subscribe(() =>
      this.router.navigate(['../../../'], {
        relativeTo: this.route,
        fragment: 'notes',
      }),
    );
  }
}
