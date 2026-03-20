import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-email-sent',
  imports: [LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './email-sent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailSentComponent {
  readonly email = input<string>();
  readonly retry = output();
}
