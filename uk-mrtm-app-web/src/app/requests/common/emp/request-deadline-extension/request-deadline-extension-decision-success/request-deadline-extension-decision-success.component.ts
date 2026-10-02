import { LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { BreadcrumbService } from '@netz/common/navigation';
import { GovukDatePipe } from '@netz/common/pipes';
import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { rdeDetailsQuery } from '@requests/common/emp/request-deadline-extension/+state/request-deadline-details.selectors';

@Component({
  selector: 'mrtm-request-deadline-extension-decision-success',
  imports: [LinkDirective, RouterLink, PanelComponent, LowerCasePipe, GovukDatePipe],
  standalone: true,
  templateUrl: './request-deadline-extension-decision-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDeadlineExtensionDecisionSuccessComponent implements OnInit {
  private readonly taskStore = inject(RequestTaskStore);
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);

  public readonly decision = this.router.currentNavigation()?.extras?.state?.decision;
  public readonly rdeDetails = this.taskStore.select(rdeDetailsQuery.selectResponseDetails);
  public readonly extDueDate: Signal<string> = computed(() => this.rdeDetails()?.currentDueDate);

  public ngOnInit(): void {
    this.breadcrumbService.showDashboardBreadcrumb();
  }
}
