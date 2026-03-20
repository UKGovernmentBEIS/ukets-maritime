import { ChangeDetectorRef, Directive, inject, input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay, takeUntil, tap } from 'rxjs';

import { UserFullNamePipe } from '@netz/common/pipes';
import { DestroySubject } from '@netz/common/services';
import { SortEvent, TableComponent } from '@netz/govuk-components';

import { UsersTableItem } from '@shared/types';

@Directive({
  selector: 'govuk-table[mrtmUsersTable]',
  standalone: true,
  providers: [UserFullNamePipe, DestroySubject],
})
export class UsersTableDirective implements OnInit {
  private readonly host = inject<TableComponent<UsersTableItem>>(TableComponent);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly destroy$ = inject(DestroySubject);
  private readonly userFullNamePipe = inject(UserFullNamePipe);
  private readonly cdRef = inject(ChangeDetectorRef);

  readonly users = input<Observable<UsersTableItem[]>>(undefined);
  readonly form = input<UntypedFormGroup>(undefined);

  private sorting$ = new BehaviorSubject<SortEvent>({ column: 'createdDate', direction: 'descending' });

  private get formArray(): UntypedFormArray {
    return this.form().get(this.formArrayName) as UntypedFormArray;
  }

  private get formArrayName(): string {
    return Object.keys(this.form().controls).find((key) => this.form().get(key) instanceof UntypedFormArray);
  }

  ngOnInit(): void {
    combineLatest([
      this.users().pipe(
        map((users) =>
          users.slice().map((userAuthority) =>
            this.fb.group(
              {
                userId: [userAuthority.userId],
                firstName: [userAuthority.firstName],
                lastName: [userAuthority.lastName],
                authorityStatus: [userAuthority.authorityStatus],
                roleCode: [userAuthority.roleCode],
                roleName: [userAuthority.roleName],
                jobTitle: [userAuthority.jobTitle],
                authorityCreationDate: [userAuthority.authorityCreationDate],
              },
              { updateOn: 'change' }, // Update on change so that the change is reflected in resorting
            ),
          ),
        ),
      ),
      this.sorting$.pipe(map((sorting) => this.createSorterByColumn(sorting))),
    ])
      .pipe(
        takeUntil(this.destroy$),
        tap(([items, sorter]) => this.setFormArray(items.sort(sorter))),
        map(() => this.formArray.value),
        tap(() => this.cdRef.markForCheck()),
        shareReplay({ bufferSize: 1, refCount: false }),
      )
      .subscribe((data) => this.host.data.set(data));
    this.host.sort.subscribe((event: SortEvent) => this.sorting$.next(event));
  }

  private createSorterByColumn({ column, direction }: SortEvent): (a: UntypedFormGroup, b: UntypedFormGroup) => number {
    return (a, b) => {
      switch (column) {
        case 'name':
          return (
            this.userFullNamePipe
              .transform(a.value)
              .localeCompare(this.userFullNamePipe.transform(b.value), 'en-GB', { sensitivity: 'base' }) *
            (direction === 'ascending' ? 1 : -1)
          );
        case 'createdDate':
          return !a.value.authorityCreationDate
            ? 1
            : !b.value.authorityCreationDate
              ? -1
              : new Date(a.value.authorityCreationDate).valueOf() - new Date(b.value.authorityCreationDate).valueOf();
      }
    };
  }

  private setFormArray(controls: UntypedFormGroup[]): void {
    this.form().setControl(this.formArrayName, this.fb.array(controls, { validators: this.formArray.validator }));
  }
}
