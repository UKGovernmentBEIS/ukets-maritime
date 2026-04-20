import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './variation-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationDetailsSummaryTemplateComponent {
  @Input({ required: true }) variationDetails: EmpVariationDetails;
  @Input() isVariationRegulator: boolean;
  @Input() regulatorLedReason: EmpVariationRegulatorLedReason;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};

  public readonly significantChangesOptions = EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS;
  public readonly nonSignificantChangesOptions = EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS;
  public readonly hasSignificantChangesItems = computed(
    () =>
      this.significantChangesOptions.filter((x) => this.variationDetails?.changes?.includes(x.value as any)).length > 0,
  );
  public readonly hasNonSignificantChangesItems = computed(
    () =>
      this.nonSignificantChangesOptions.filter((x) => this.variationDetails?.changes?.includes(x.value as any)).length >
      0,
  );
}
