import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-request-two-fa-reset',
  templateUrl: './request-two-fa-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeadingComponent, RouterLink, LinkDirective],
})
export class RequestTwoFaResetComponent {}
