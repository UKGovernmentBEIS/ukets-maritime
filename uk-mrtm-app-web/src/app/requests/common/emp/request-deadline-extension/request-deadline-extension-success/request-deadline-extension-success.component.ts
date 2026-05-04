import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { RequestDeadlineExtensionStore } from '@requests/common/emp/request-deadline-extension/services';

@Component({
  selector: 'mrtm-request-deadline-extension-success',
  imports: [LinkDirective, RouterLink, PanelComponent],
  standalone: true,
  templateUrl: './request-deadline-extension-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDeadlineExtensionSuccessComponent implements OnInit {
  private readonly rdeStore = inject(RequestDeadlineExtensionStore);

  public ngOnInit(): void {
    this.rdeStore.reset();
  }
}
