import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GovukSpacingUnit } from '../types';

@Component({
  selector: 'govuk-warning-text',
  standalone: true,
  templateUrl: './warning-text.component.html',
  styleUrl: './warning-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningTextComponent {
  @Input() assistiveText = 'Warning';
  @Input() bottomSpacing: GovukSpacingUnit = 6;
}
