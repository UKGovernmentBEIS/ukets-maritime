import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-unappoint-confirmation',
  imports: [LinkDirective, PanelComponent, RouterLink],
  standalone: true,
  templateUrl: './unappoint-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnappointConfirmationComponent {}
