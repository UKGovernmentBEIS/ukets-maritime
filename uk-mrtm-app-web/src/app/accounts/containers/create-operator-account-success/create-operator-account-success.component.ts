import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-create-operator-account-success',
  templateUrl: './create-operator-account-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, PanelComponent, LinkDirective],
})
export class CreateOperatorAccountSuccessComponent {}
