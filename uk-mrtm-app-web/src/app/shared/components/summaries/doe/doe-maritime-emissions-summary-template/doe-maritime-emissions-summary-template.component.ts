import { CurrencyPipe, I18nSelectPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DoeMaritimeEmissions, DoeTotalMaritimeEmissions } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';
import { AttachedFile, determinationTypeMap, determineReasonTypeMap, SubTaskListMap } from '@shared/types';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'mrtm-doe-maritime-emissions-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    NotProvidedDirective,
    SummaryDownloadFilesComponent,
    BooleanToTextPipe,
    CurrencyPipe,
    GovukDatePipe,
    I18nSelectPipe,
  ],
  templateUrl: './doe-maritime-emissions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoeMaritimeEmissionsSummaryTemplateComponent {
  private readonly authStore = inject(AuthStore);

  public readonly data: InputSignal<DoeMaritimeEmissions> = input<DoeMaritimeEmissions>();
  public readonly isEditable: InputSignal<boolean> = input<boolean>(false);
  public readonly files: InputSignal<Array<AttachedFile>> = input<Array<AttachedFile>>();
  public readonly map = input.required<SubTaskListMap<DoeMaritimeEmissions>>();
  public readonly doeTotalMaritimeEmissionsMap = input.required<SubTaskListMap<DoeTotalMaritimeEmissions>>();
  public readonly wizardStep: InputSignal<Record<string, string>> = input<Record<string, string>>();
  public readonly userRole = this.authStore.select(selectUserRoleType);
  public readonly totalOperatorFee = computed(() => {
    const maritimeEmissions = this.data();

    return new BigNumber(maritimeEmissions?.feeDetails?.totalBillableHours ?? '0')
      .multipliedBy(maritimeEmissions?.feeDetails?.hourlyRate ?? '0')
      .toFixed(2, BigNumber.ROUND_HALF_UP);
  });

  public readonly determineReasonTypeMap = determineReasonTypeMap;
  public readonly determinationTypeMap = determinationTypeMap;
}
