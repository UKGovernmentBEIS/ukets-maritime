import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { RequestForInformationStore } from '@requests/common/emp/request-for-information/services';

@Component({
  selector: 'mrtm-request-for-information-success',
  standalone: true,
  imports: [LinkDirective, RouterLink, PanelComponent],
  templateUrl: './request-for-information-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationSuccessComponent implements OnInit {
  private readonly rfiStore = inject(RequestForInformationStore);

  public ngOnInit(): void {
    this.rfiStore.reset();
  }
}
