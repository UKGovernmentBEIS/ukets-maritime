import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-variation-confirmation',
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
  templateUrl: './submit-send-variation-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitSendVariationSuccessComponent {}
