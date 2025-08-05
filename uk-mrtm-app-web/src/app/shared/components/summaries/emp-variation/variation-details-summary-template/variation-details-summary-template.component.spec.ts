import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { VariationDetailsSummaryTemplateComponent } from '@shared/components';

describe('VariationDetailsSummaryTemplateComponent', () => {
  class Page extends BasePage<VariationDetailsSummaryTemplateComponent> {}

  let component: VariationDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<VariationDetailsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariationDetailsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VariationDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.variationDetails = {
      reason: 'Test reason',
      changes: [
        'ADD_NEW_FUELS_OR_EMISSION_SOURCES',
        'CHANGE_COMPANY_NAME_OR_REGISTERED_ADDRESS',
        'OTHER_NON_SIGNIFICANT',
        'OTHER_NON_SIGNIFICANT',
      ],
      otherNonSignificantChangeReason: 'Test otherNonSignificantChangeReason',
      otherSignificantChangeReason: 'Test otherSignificantChangeReason',
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Significant changes',
      'Addition of new fuels or emissions sources, including sustainable fuels  Changing the company name or registered office address',
      'Non significant changes',
      'Other  : Test otherNonSignificantChangeReason',
      'Explain what you are changing and the reasons for the changes',
      'Test reason',
    ]);
  });
});
