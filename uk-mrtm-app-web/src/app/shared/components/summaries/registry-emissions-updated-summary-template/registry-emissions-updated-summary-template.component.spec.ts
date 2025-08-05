import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { RegistryEmissionsUpdatedSummaryTemplateComponent } from '@shared/components';

describe('RegistryEmissionsUpdatedSummaryTemplateComponent', () => {
  let component: RegistryEmissionsUpdatedSummaryTemplateComponent;
  let fixture: ComponentFixture<RegistryEmissionsUpdatedSummaryTemplateComponent>;
  let page: Page;
  class Page extends BasePage<RegistryEmissionsUpdatedSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryEmissionsUpdatedSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryEmissionsUpdatedSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      payloadType: 'REGISTRY_UPDATED_EMISSIONS_EVENT_SUBMITTED_PAYLOAD',
      registryId: 1234567,
      reportableEmissions: 5.234,
      reportingYear: '2024',
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual(['Reporting year', '2024', 'Emissions figure for surrender', '5.234 tCO2']);
  });
});
