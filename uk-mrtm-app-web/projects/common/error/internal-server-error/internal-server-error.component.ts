import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { LinkDirective } from '@netz/govuk-components';

import { GenericServiceErrorCode } from '../service-errors';

@Component({
  selector: 'netz-internal-server-error',
  imports: [PageHeadingComponent, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalServerErrorComponent {
  private readonly router = inject(Router);

  errorCode = this.router.currentNavigation()?.extras?.state?.errorCode;
  genericServiceErrorCode = GenericServiceErrorCode;
}
