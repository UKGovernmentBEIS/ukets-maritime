import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpVariationDetails, EmpVariationRegulatorLedReason } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS,
  EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS,
} from '@shared/constants';
import { NotProvidedDirective } from '@shared/directives';
import { RegulatorLedReasonPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-variation-details-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    RegulatorLedReasonPipe,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './variation-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationDetailsSummaryTemplateComponent {
  readonly variationDetails = input.required<EmpVariationDetails>();
  readonly isVariationRegulator = input<boolean>();
  readonly regulatorLedReason = input<EmpVariationRegulatorLedReason>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});

  public readonly significantChangesOptions = EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS;
  public readonly nonSignificantChangesOptions = EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS;
  public readonly hasSignificantChangesItems = computed(
    () =>
      this.significantChangesOptions.filter((x) => this.variationDetails()?.changes?.includes(x.value as any)).length >
      0,
  );
  public readonly hasNonSignificantChangesItems = computed(
    () =>
      this.nonSignificantChangesOptions.filter((x) => this.variationDetails()?.changes?.includes(x.value as any))
        .length > 0,
  );
}
