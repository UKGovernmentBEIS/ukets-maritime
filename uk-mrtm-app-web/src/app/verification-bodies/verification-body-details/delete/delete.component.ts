import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';

import { switchMap, take } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchElseRethrow, HttpStatuses } from '@netz/common/error';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';
import { saveNotFoundVerificationBodyError } from '@verification-bodies/errors/business-error';

@Component({
  selector: 'mrtm-delete',
  imports: [
    PageHeadingComponent,
    WarningTextComponent,
    ButtonDirective,
    LinkDirective,
    PendingButtonDirective,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponent {
  private readonly store: VerificationBodiesStoreService = inject(VerificationBodiesStoreService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly businessErrorService = inject(BusinessErrorService);

  public handleDelete(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.store.deleteVerificationBody(Number(params.get('id')))),
        take(1),
        catchElseRethrow(
          (error) => error.status === HttpStatuses.NotFound,
          () => this.businessErrorService.showError(saveNotFoundVerificationBodyError),
        ),
      )
      .subscribe(() => {
        this.router.navigate(['success'], { relativeTo: this.activatedRoute });
      });
  }
}
