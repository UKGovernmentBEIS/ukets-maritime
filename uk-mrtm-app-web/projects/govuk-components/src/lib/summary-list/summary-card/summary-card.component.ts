import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, HostBinding, input, TemplateRef } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div[govuk-summary-card]',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="govuk-summary-card__title-wrapper">
      <h2 class="govuk-summary-card__title">{{ title() }}</h2>
      @if (this.actions(); as actions) {
        <ul class="govuk-summary-card__actions">
          <ng-container [ngTemplateOutlet]="actions"></ng-container>
        </ul>
      }
    </div>
    <div class="govuk-summary-card__content">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  title = input.required<string>();
  actions = contentChild<TemplateRef<any>>('actions');

  @HostBinding('class.govuk-summary-card') readonly govukSummaryCard = true;
}
