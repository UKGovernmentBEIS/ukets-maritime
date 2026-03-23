import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { LinkDirective } from '@netz/govuk-components';

import { GenericServiceErrorCode } from '../service-errors';

@Component({
  selector: 'netz-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeadingComponent, LinkDirective, RouterLink],
})
export class InternalServerErrorComponent {
  private readonly router = inject(Router);

  errorCode = this.router.getCurrentNavigation().extras?.state?.errorCode;
  genericServiceErrorCode = GenericServiceErrorCode;
}
