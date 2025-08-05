import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { OperatorUserRegistrationDTO } from '@mrtm/api';

import { GovukComponentsModule } from '@netz/govuk-components';

import { PhoneNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-user-input-summary-template',
  standalone: true,
  imports: [GovukComponentsModule, RouterLink, PhoneNumberPipe],
  templateUrl: './user-input-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInputSummaryTemplateComponent implements OnInit {
  readonly route = inject(ActivatedRoute);

  @Input() userInfo: Partial<Omit<OperatorUserRegistrationDTO, 'emailToken'>>;
  @Input() changeLink: string;

  changeQueryParams: Params = { change: true };
  modifiedUserInfo: Partial<Omit<OperatorUserRegistrationDTO, 'emailToken'>>;

  ngOnInit(): void {
    this.modifiedUserInfo = this.userInfo;
  }
}
