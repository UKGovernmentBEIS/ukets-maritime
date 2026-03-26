import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'netz-page-heading',
  standalone: true,
  template: `
    @if (caption(); as caption) {
      <span [class]="captionClass()">{{ caption }}</span>
    }
    <h1 [class]="headingClass()">
      <ng-content />
    </h1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeadingComponent {
  readonly caption = input<string>();
  readonly size = input<'l' | 'xl'>('l');

  readonly headingClass = computed(() => 'govuk-heading-' + this.size());
  readonly captionClass = computed(() => 'govuk-caption-' + this.size());
}
