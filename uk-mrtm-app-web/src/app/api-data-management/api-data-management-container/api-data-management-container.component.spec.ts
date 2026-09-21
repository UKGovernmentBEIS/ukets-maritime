import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ApiDataManagementContainerComponent } from '@api-data-management/api-data-management-container/api-data-management-container.component';

describe('ApiDataManagementContainerComponent', () => {
  let component: ApiDataManagementContainerComponent;
  let fixture: ComponentFixture<ApiDataManagementContainerComponent>;
  let router: Router;
  let page: Page;

  class Page extends BasePage<ApiDataManagementContainerComponent> {
    get details() {
      return this.query<HTMLDetailsElement>('details.govuk-details');
    }

    get detailsSummary() {
      return this.query<HTMLSpanElement>('.govuk-details__summary-text');
    }

    get detailsText() {
      return this.query<HTMLDivElement>('.govuk-details__text');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiDataManagementContainerComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiDataManagementContainerComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no selected tab and import unavailable', () => {
    expect(component.currentTab()).toBeNull();
    expect((component as any).isImportAvailable()).toBe(false);
  });

  it('should update the current tab and navigate when a tab is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const activatedRoute = TestBed.inject(ActivatedRoute);

    component.handleSelectedTab('activity-history');

    expect(component.currentTab()).toBe('activity-history');
    expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: activatedRoute, preserveFragment: true });
  });

  it('should flag import as available when the available-to-import tab reports it', () => {
    (component as any).handleIsImportAvailable(true);
    expect((component as any).isImportAvailable()).toBe(true);
  });

  it('should coerce a falsy value to false when flagging import availability', () => {
    (component as any).handleIsImportAvailable(undefined);
    expect((component as any).isImportAvailable()).toBe(false);
  });

  it('should render a details expander explaining who should use API data management', () => {
    fixture.detectChanges();

    expect(page.details).toBeTruthy();
    expect(page.detailsSummary.innerHTML.trim()).toEqual('Who should use API data management');
    expect(page.detailsText.textContent).toContain('Review the data available to be imported');
    expect(page.detailsText.textContent).toContain('Select the accounts that will receive data');
    expect(page.detailsText.textContent).toContain('Check that the import was successful and retry if necessary');
  });
});
