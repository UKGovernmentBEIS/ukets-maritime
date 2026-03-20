import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-create-operator-account-success',
  imports: [RouterLink, PanelComponent, LinkDirective],
  standalone: true,
  templateUrl: './create-operator-account-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOperatorAccountSuccessComponent {}
