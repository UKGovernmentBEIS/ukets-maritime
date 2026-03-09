import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-account-closure-success',
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
  templateUrl: './account-closure-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureSuccessComponent {}
