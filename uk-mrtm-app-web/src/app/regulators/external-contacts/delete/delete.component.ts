import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BehaviorSubject, first, map, Observable, switchMap } from 'rxjs';

import { CaExternalContactDTO, CaExternalContactsService } from '@mrtm/api';

import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';
import { ButtonDirective, LinkDirective, PanelComponent, WarningTextComponent } from '@netz/govuk-components';

import { saveNotFoundExternalContactError } from '@regulators/errors/business-error';

@Component({
  selector: 'mrtm-delete',
  imports: [
    WarningTextComponent,
    ButtonDirective,
    PendingButtonDirective,
    LinkDirective,
    RouterLink,
    PanelComponent,
    AsyncPipe,
  ],
  standalone: true,
  templateUrl: './delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponent {
  private readonly externalContactsService = inject(CaExternalContactsService);
  private readonly route = inject(ActivatedRoute);
  private readonly businessErrorService = inject(BusinessErrorService);

  contact$: Observable<CaExternalContactDTO> = this.route.data.pipe(map((x) => x?.contact));
  isConfirmationDisplayed$ = new BehaviorSubject<boolean>(false);

  deleteExternalContact(): void {
    this.contact$
      .pipe(
        first(),
        switchMap((contact) => this.externalContactsService.deleteCaExternalContactById(contact.id)),
        catchBadRequest(ErrorCodes.EXTCONTACT1000, () =>
          this.businessErrorService.showError(saveNotFoundExternalContactError),
        ),
      )
      .subscribe(() => this.isConfirmationDisplayed$.next(true));
  }
}
