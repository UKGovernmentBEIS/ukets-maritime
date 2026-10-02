import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { ButtonDirective, DetailsComponent, TabDirective, TabsComponent } from '@netz/govuk-components';

import { ApiDataManagementActivityHistoryComponent } from '@api-data-management/api-data-management-activity-history';
import { ApiDataManagementAvailableToImportComponent } from '@api-data-management/api-data-management-available-to-import';

@Component({
  selector: 'mrtm-api-data-management-container',
  imports: [
    PageHeadingComponent,
    TabsComponent,
    TabDirective,
    ApiDataManagementAvailableToImportComponent,
    ApiDataManagementActivityHistoryComponent,
    ButtonDirective,
    RouterLink,
    DetailsComponent,
  ],
  templateUrl: './api-data-management-container.component.html',
})
export class ApiDataManagementContainerComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly currentTab = signal<string>(null);
  protected readonly isImportAvailable = signal<boolean>(false);
  public handleSelectedTab(tab: string): void {
    if (tab !== this.currentTab()) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: undefined },
        fragment: tab,
        scroll: 'manual',
      });
      this.currentTab.set(tab);
    }
  }

  protected handleIsImportAvailable($event: boolean) {
    this.isImportAvailable.set(!!$event);
  }
}
