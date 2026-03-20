import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-request-for-information-respond-success',
  imports: [LinkDirective, RouterLink, PanelComponent],
  standalone: true,
  templateUrl: './request-for-information-respond-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationRespondSuccessComponent {}
