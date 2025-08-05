import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PanelComponent } from '@netz/govuk-components';

import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';

@Component({
  selector: 'mrtm-notify-operator-success',
  standalone: true,
  imports: [NgComponentOutlet, PanelComponent],
  templateUrl: './notify-operator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyOperatorSuccessComponent {
  public readonly successComponent = inject(NOTIFY_OPERATOR_SUCCESS_COMPONENT, { optional: true });
}
