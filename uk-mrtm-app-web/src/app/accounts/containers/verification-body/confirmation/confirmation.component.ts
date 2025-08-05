import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map } from 'rxjs';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-confirmation',
  templateUrl: './confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
})
export class ConfirmationComponent {
  @Input({ required: true }) verificationAccount: string;
  private readonly route = inject(ActivatedRoute);
  accountId$ = this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('accountId'))));
}
