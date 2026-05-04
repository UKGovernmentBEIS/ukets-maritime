import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-send-variation-confirmation',
  imports: [PanelComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './submit-send-variation-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitSendVariationSuccessComponent {}
