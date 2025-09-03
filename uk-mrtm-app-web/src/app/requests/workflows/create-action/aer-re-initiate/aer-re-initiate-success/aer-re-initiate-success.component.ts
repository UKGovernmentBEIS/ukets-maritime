import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbService } from '@netz/common/navigation';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-aer-re-initiate-success',
  standalone: true,
  imports: [RouterLink, LinkDirective, PanelComponent],
  templateUrl: './aer-re-initiate-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerReInitiateSuccessComponent implements OnInit {
  private readonly breadcrumbService = inject(BreadcrumbService);
  public ngOnInit(): void {
    this.breadcrumbService.showDashboardBreadcrumb();
  }
}
