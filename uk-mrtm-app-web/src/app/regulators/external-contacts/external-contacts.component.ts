import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';

import { CaExternalContactDTO, CaExternalContactsService } from '@mrtm/api';

import { ButtonDirective, GovukTableColumn, LinkDirective, SortEvent, TableComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-external-contacts',
  imports: [ButtonDirective, TableComponent, LinkDirective, RouterLink, AsyncPipe],
  standalone: true,
  templateUrl: './external-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalContactsComponent implements OnInit {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly externalContactsService = inject(CaExternalContactsService);

  sorting$ = new BehaviorSubject<SortEvent>({ column: 'lastUpdatedDate', direction: 'ascending' });
  contacts$: Observable<CaExternalContactDTO[]>;
  isEditable$: Observable<boolean>;
  editableColumns: GovukTableColumn<CaExternalContactDTO>[] = [
    { field: 'name', header: 'Displayed name', isSortable: true, isHeader: true },
    { field: 'email', header: 'Email address', isSortable: true },
    { field: 'description', header: 'Description' },
    { field: null, header: 'Actions', hiddenHeader: true },
  ];
  nonEditableColumns = this.editableColumns.slice(0, 3);

  ngOnInit(): void {
    const contactResponse$ = this.externalContactsService
      .getCaExternalContacts()
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    this.isEditable$ = contactResponse$.pipe(map((caExternalContactsDTO) => caExternalContactsDTO?.isEditable));
    this.contacts$ = combineLatest([
      contactResponse$.pipe(map((caExternalContactsDTO) => caExternalContactsDTO?.caExternalContacts)),
      this.sorting$,
    ]).pipe(map(([contacts, sorting]) => contacts.slice().sort(this.sortContacts(sorting))));
  }

  private sortContacts(sorting: SortEvent): (a: CaExternalContactDTO, b: CaExternalContactDTO) => number {
    return (a, b) => {
      let diff: number;

      switch (sorting.column) {
        case 'name':
        case 'email':
          diff = a[sorting.column].localeCompare(b[sorting.column], 'en-GB', { sensitivity: 'base' });
          break;
        default:
          diff = new Date(a.lastUpdatedDate).valueOf() - new Date(b.lastUpdatedDate).valueOf();
          break;
      }

      return diff * (sorting.direction === 'ascending' ? 1 : -1);
    };
  }
}
