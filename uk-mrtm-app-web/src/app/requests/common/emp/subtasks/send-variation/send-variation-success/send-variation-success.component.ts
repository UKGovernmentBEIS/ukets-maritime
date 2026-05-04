import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SEND_VARIATION_SUCCESS_COMPONENT } from '@requests/common/emp/subtasks/send-variation';

@Component({
  selector: 'mrtm-send-variation-success',
  imports: [NgComponentOutlet],
  standalone: true,
  templateUrl: './send-variation-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendVariationSuccessComponent {
  public readonly successComponent = inject(SEND_VARIATION_SUCCESS_COMPONENT, { optional: true });
}
