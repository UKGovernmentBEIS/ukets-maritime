import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'govuk-phase-banner',
  imports: [],
  standalone: true,
  templateUrl: './phase-banner.component.html',
  styleUrl: './phase-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseBannerComponent {
  readonly phase = input<string>();
  readonly tagColor = input<string>();
  readonly tagAlign = input<'right' | 'left'>('left');

  /** Moves the dividing line to the top edge, for a banner placed at the bottom of the page. */
  readonly borderTop = input(false, { transform: booleanAttribute });
}
