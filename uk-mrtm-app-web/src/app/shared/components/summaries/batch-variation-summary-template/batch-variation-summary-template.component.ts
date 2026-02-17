import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { BatchVariationSummaryModel } from '@shared/types';

@Component({
  selector: 'mrtm-batch-variation-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './batch-variation-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchVariationSummaryTemplateComponent {
  public readonly isEditable: InputSignal<boolean> = input<boolean>(false);
  public readonly data: InputSignal<BatchVariationSummaryModel> = input.required<BatchVariationSummaryModel>();
  public readonly queryParams: InputSignal<Params> = input<Params>();
  public readonly wizardStep: InputSignal<Record<string, string>> = input<Record<string, string>>();
}
