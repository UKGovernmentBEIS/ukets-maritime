import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map, merge, Observable, shareReplay, Subject, switchMap, takeUntil, tap } from 'rxjs';

import {
  RegulatorAuthoritiesService,
  RegulatorUserAuthorityInfoDTO,
  RegulatorUsersAuthoritiesInfoDTO,
} from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';
import { UserFullNamePipe } from '@netz/common/pipes';
import { DestroySubject } from '@netz/common/services';
import {
  ButtonDirective,
  GovukSelectOption,
  GovukTableColumn,
  LinkDirective,
  SelectComponent,
  TabDirective,
  TableComponent,
  TabsComponent,
} from '@netz/govuk-components';

import { savePartiallyNotFoundRegulatorError } from '@regulators/errors/business-error';
import { ExternalContactsComponent } from '@regulators/external-contacts/external-contacts.component';
import { SiteContactsComponent } from '@regulators/site-contacts/site-contacts.component';
import { NotificationBannerComponent } from '@shared/components';
import { NotificationBannerStore } from '@shared/components/notification-banner';
import { UsersTableDirective } from '@shared/directives';
import { FormUtils } from '@shared/utils';

@Component({
  selector: 'mrtm-regulators',
  templateUrl: './regulators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
  standalone: true,
  imports: [
    PageHeadingComponent,
    TabsComponent,
    TabDirective,
    ButtonDirective,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TableComponent,
    LinkDirective,
    SelectComponent,
    PendingButtonDirective,
    SiteContactsComponent,
    ExternalContactsComponent,
    AsyncPipe,
    UserFullNamePipe,
    UsersTableDirective,
    NotificationBannerComponent,
  ],
})
export class RegulatorsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = inject(DestroySubject);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly notificationBannerStore: NotificationBannerStore = inject(NotificationBannerStore);
  regulators$: Observable<RegulatorUserAuthorityInfoDTO[]>;
  isEditable$: Observable<boolean>;
  public authorityStatusesOptions: { [key: string]: any } = {};
  authorityStatuses: GovukSelectOption<string>[] = [
    { text: 'Active', value: 'ACTIVE' },
    { text: 'Disabled', value: 'DISABLED' },
  ];
  authorityStatusesAccepted: GovukSelectOption<string>[] = [
    { text: 'Accepted', value: 'ACCEPTED' },
    { text: 'Active', value: 'ACTIVE' },
  ];
  editableCols: GovukTableColumn[] = [
    { field: 'name', header: 'Name', isSortable: true },
    { field: 'jobTitle', header: 'Job title' },
    { field: 'authorityStatus', header: 'Account status' },
    { field: 'deleteBtn', header: undefined },
  ];
  nonEditableCols: GovukTableColumn[] = this.editableCols.slice(0, 2);
  regulatorsForm = this.fb.group({ regulatorsArray: this.fb.array([]) });
  userId$ = this.authStore.rxSelect(selectUserId);
  refresh$ = new Subject<void>();

  get regulatorsArray(): UntypedFormArray {
    return this.regulatorsForm.get('regulatorsArray') as UntypedFormArray;
  }

  ngOnInit(): void {
    const regulatorsManagement$ = merge(
      this.route.data.pipe(map((data: { regulators: RegulatorUsersAuthoritiesInfoDTO }) => data.regulators)),
      this.refresh$.pipe(switchMap(() => this.regulatorAuthoritiesService.getCaRegulators())),
    ).pipe(
      tap((authoritiesInfoDTO) => {
        // Initialize authorityStatusesOptions for each user in regulatorsArray
        if (authoritiesInfoDTO?.caUsers) {
          this.authorityStatusesOptions = {}; // Reset options before each update
          authoritiesInfoDTO.caUsers.forEach((user) => {
            this.authorityStatusesOptions[user.userId] =
              user.authorityStatus === 'ACCEPTED' ? this.authorityStatusesAccepted : this.authorityStatuses;
          });
        }
      }),
      takeUntil(this.destroy$),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.regulators$ = regulatorsManagement$.pipe(map((authoritiesInfoDTO) => authoritiesInfoDTO?.caUsers));
    this.isEditable$ = regulatorsManagement$.pipe(map((authoritiesInfoDTO) => authoritiesInfoDTO?.editable));
  }

  saveRegulators(): void {
    if (!this.regulatorsForm.dirty) {
      return;
    }
    if (!this.regulatorsForm.valid) {
      this.regulatorsForm.markAllAsTouched();
      this.notificationBannerStore.setInvalidForm(this.regulatorsForm);
    } else {
      this.regulatorAuthoritiesService
        .updateCompetentAuthorityRegulatorUsersStatus(
          this.regulatorsArray.controls
            .filter((control) => control.dirty)
            .map((control) => ({
              authorityStatus: control.value.authorityStatus,
              userId: control.value.userId,
            })),
        )
        .pipe(
          catchBadRequest(ErrorCodes.AUTHORITY1003, () =>
            this.businessErrorService.showError(savePartiallyNotFoundRegulatorError),
          ),
          tap(() => {
            const updatedControlsKeys = FormUtils.findDirtyControlsKeys(this.regulatorsForm);

            if (updatedControlsKeys.length !== 0) {
              this.notificationBannerStore.setSuccessMessages(this.createSuccessMessages(updatedControlsKeys));
              this.regulatorsForm.markAsPristine();
            } else {
              this.notificationBannerStore.reset();
            }
          }),
        )
        .subscribe(() => this.refresh$.next());
    }
  }

  discardChanges(): void {
    if (!this.regulatorsForm.dirty) {
      return;
    }

    this.refresh$.next();
    this.regulatorsForm.markAsPristine();
  }

  private createSuccessMessages(controlKeys: string[]): string[] {
    return controlKeys.map((key) => `${this.editableCols.find((col) => col.field === key).header} updated`);
  }
}
