import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-request-for-information-respond-success',
  standalone: true,
  imports: [LinkDirective, RouterLink, PanelComponent],
  templateUrl: './request-for-information-respond-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationRespondSuccessComponent {}
