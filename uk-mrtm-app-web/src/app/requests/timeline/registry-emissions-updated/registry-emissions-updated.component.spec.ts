import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryUpdatedEmissionsEventSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { RegistryEmissionsUpdatedComponent } from '@requests/timeline/registry-emissions-updated/registry-emissions-updated.component';

describe('RegistryEmissionsUpdatedComponent', () => {
  let component: RegistryEmissionsUpdatedComponent;
  let fixture: ComponentFixture<RegistryEmissionsUpdatedComponent>;
  let page: Page;
  let store: RequestActionStore;

  class Page extends BasePage<RegistryEmissionsUpdatedComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryEmissionsUpdatedComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        id: 59,
        type: 'REGISTRY_UPDATED_EMISSIONS_EVENT_SUBMITTED',
        payload: {
          payloadType: 'REGISTRY_UPDATED_EMISSIONS_EVENT_SUBMITTED_PAYLOAD',
          registryId: 1234567,
          reportableEmissions: 5.234,
          reportingYear: '2024',
        } as unknown as RegistryUpdatedEmissionsEventSubmittedRequestActionPayload,
        requestId: 'MAR00008-2024',
        requestType: 'AER',
        requestAccountId: 8,
        competentAuthority: 'ENGLAND',
        submitter: 'Operator8 England',
        creationDate: '2025-06-05T12:56:33.951409Z',
      },
    });

    fixture = TestBed.createComponent(RegistryEmissionsUpdatedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for empty data', () => {
    expect(page.summariesContents).toEqual(['Reporting year', '2024', 'Emissions figure for surrender', '5.234 tCO2']);
  });
});
