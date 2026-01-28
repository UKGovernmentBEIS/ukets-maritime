import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'netz-timeline',
  standalone: true,
  template: `
    <h2 class="govuk-heading-m">Timeline</h2>
    <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" aria-hidden="true" />
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {}
