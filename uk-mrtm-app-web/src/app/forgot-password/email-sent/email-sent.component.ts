import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-email-sent',
  templateUrl: './email-sent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LinkDirective, RouterLink],
})
export class EmailSentComponent {
  @Input() email: string;
  @Output() readonly retry = new EventEmitter();
}
