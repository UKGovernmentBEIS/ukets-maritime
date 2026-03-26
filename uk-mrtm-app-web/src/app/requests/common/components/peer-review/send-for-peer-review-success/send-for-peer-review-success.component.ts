import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-for-peer-review-success',
  imports: [PanelComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './send-for-peer-review-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendForPeerReviewSuccessComponent {
  private readonly router = inject(Router);
  public readonly assignedTo = this.router.currentNavigation()?.extras?.state?.assignedTo;
}
