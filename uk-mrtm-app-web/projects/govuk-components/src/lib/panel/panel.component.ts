import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'govuk-panel',
  standalone: true,
  imports: [],
  templateUrl: './panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .govuk-panel__body:empty {
      display: none;
    }
  `,
})
export class PanelComponent {
  @Input() title: string;
}
