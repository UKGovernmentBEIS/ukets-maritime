import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';
import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-request-two-fa-reset',
  imports: [PageHeadingComponent, LinkDirective],
  standalone: true,
  templateUrl: './request-two-fa-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTwoFaResetComponent {}
