import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-vir-review-notify-operator-success',
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
  templateUrl: './vir-review-notify-operator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirReviewNotifyOperatorSuccessComponent {}
