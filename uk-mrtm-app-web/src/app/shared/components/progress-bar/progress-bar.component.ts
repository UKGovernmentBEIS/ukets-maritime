import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'mrtm-progress-bar',
  standalone: true,
  template: `
    <div
      class="progress-bar"
      role="progressbar"
      aria-live="polite"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
      [attr.aria-valuenow]="fillWidth()">
      <div class="progress-bar__list">
        @for (item of items(); track $index) {
          <div class="progress-bar__item" [style.width.%]="itemWidth()"></div>
        }
      </div>
      <div class="progress-bar__overlay" [style.width.%]="fillWidth()" [style.background-color]="fillColor()"></div>
    </div>
  `,
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  readonly progressValue = input.required<number | null>();
  readonly ariaLabel = input.required<string>();
  readonly progressItems = input(5);
  readonly colors = input<string[]>(['#d4351c', '#d4351c', '#f47738', '#00703c', '#00703c']);

  readonly items = computed(() => Array.from({ length: Math.max(1, this.progressItems()) }));
  readonly itemWidth = computed(() => 100 / Math.max(1, this.progressItems()));
  readonly fillWidth = computed(() => {
    const strength = this.progressValue();
    if (strength === null || strength === undefined) {
      return 0;
    }

    const step = this.itemWidth();
    const percentage = ((strength + 1) / 5) * 100;

    return Math.min(100, Math.round(percentage / step) * step);
  });
  readonly fillColor = computed(() => {
    const cols = this.colors();
    if (!cols || cols.length === 0) return 'transparent';

    const progressLevel = (this.fillWidth() / 100) * this.progressItems();
    const index = Math.min(Math.max(Math.ceil(progressLevel) - 1, 0), cols.length - 1);

    return cols[index];
  });
}
