import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GovukSpacingUnit } from '../types';

@Component({
  selector: 'govuk-warning-text',
  standalone: true,
  templateUrl: './warning-text.component.html',
  styleUrl: './warning-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningTextComponent {
  readonly assistiveText = input('Warning');
  readonly bottomSpacing = input<GovukSpacingUnit>(6);
}
