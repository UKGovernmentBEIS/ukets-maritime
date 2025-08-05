import { Route } from '@angular/router';

import { PendingRequestGuard } from '@core/guards';
import { DeleteNoteComponent, UpsertNoteComponent } from '@notes/components';

export const NOTES_ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'add',
        title: 'Add a note',
        data: { heading: 'Add a note', breadcrumb: false, backlink: '../../', backlinkFragment: 'notes' },
        component: UpsertNoteComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: ':noteId/edit',
        title: 'Change the note',
        data: { heading: 'Change the note', breadcrumb: false, backlink: '../../../', backlinkFragment: 'notes' },
        component: UpsertNoteComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: ':noteId/delete',
        title: 'Delete a note',
        data: { breadcrumb: false, backlink: '../../../', backlinkFragment: 'notes' },
        component: DeleteNoteComponent,
        canDeactivate: [PendingRequestGuard],
      },
    ],
  },
];
