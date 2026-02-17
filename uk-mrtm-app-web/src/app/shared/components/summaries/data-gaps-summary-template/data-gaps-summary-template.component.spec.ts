import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { DataGapsSummaryTemplateComponent } from '@shared/components';

describe('DataGapsSummaryTemplateComponent', () => {
  let component: DataGapsSummaryTemplateComponent;
  let fixture: ComponentFixture<DataGapsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<DataGapsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGapsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGapsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dataGaps', {
      fuelConsumptionEstimationMethod: 'some description',
      responsiblePersonOrPosition: 'person',
      dataSources: 'data sources',
      recordsLocation: 'location',
      itSystemUsed: 'it',
    });
    fixture.componentRef.setInput('wizardStep', {
      DATA_GAPS_METHOD: 'data-gaps-method',
    });
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Description of method to estimate fuel consumption',
      'some description',
      'Change',
      'Name of person or position responsible for this procedure',
      'person',
      'Change',
      'Formulae used',
      'Not provided',
      'Change',
      'Data sources',
      'data sources',
      'Change',
      'Location where records are kept',
      'location',
      'Change',
      'Name of IT system used',
      'it',
      'Change',
    ]);
  });
});
