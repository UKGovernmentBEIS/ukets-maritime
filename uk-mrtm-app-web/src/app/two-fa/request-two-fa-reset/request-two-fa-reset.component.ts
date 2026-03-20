import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-request-two-fa-reset',
  imports: [PageHeadingComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './request-two-fa-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTwoFaResetComponent {}
