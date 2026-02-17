import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { OperatorUserRegistrationDTO } from '@mrtm/api';

import { GovukComponentsModule } from '@netz/govuk-components';

import { PhoneNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-user-input-summary-template',
  imports: [GovukComponentsModule, RouterLink, PhoneNumberPipe],
  standalone: true,
  templateUrl: './user-input-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInputSummaryTemplateComponent implements OnInit {
  readonly route = inject(ActivatedRoute);

  readonly userInfo = input<Partial<Omit<OperatorUserRegistrationDTO, 'emailToken'>>>();
  readonly changeLink = input<string>();

  changeQueryParams: Params = { change: true };
  modifiedUserInfo: Partial<Omit<OperatorUserRegistrationDTO, 'emailToken'>>;

  ngOnInit(): void {
    this.modifiedUserInfo = this.userInfo();
  }
}
