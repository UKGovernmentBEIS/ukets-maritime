import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'mrtm-more-less-text',
  imports: [NgStyle],
  standalone: true,
  templateUrl: './more-less.component.html',
  styleUrl: './more-less.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreLessComponent {
  readonly text = input.required<string>();
  readonly index = input<number>(0);
  readonly lines = input<number>();
  readonly widthClass = input<string>();

  readonly moreIsClicked = signal(false);
  readonly class = computed(() => {
    if (this.moreIsClicked()) return '';
    return this.lines() ? 'cell-ellipsis-multi-line' : 'cell-ellipsis-single-line';
  });
  readonly currentWidthClass = computed(() => `${this.widthClass()} ${this.lines() ? ' pre-line' : ''}`);
  readonly isTextOverflow = computed(() => {
    const elem = document.getElementById(`more-less-text-${this.index()}`);

    if (this.lines()) {
      return elem.clientHeight < elem.scrollHeight || this.moreIsClicked();
    } else {
      return elem.offsetWidth < elem.scrollWidth || this.moreIsClicked();
    }
  });

  moreLessClicked() {
    this.moreIsClicked.update((v) => !v);
  }
}
