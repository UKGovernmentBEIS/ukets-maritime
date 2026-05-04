import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { MandateSummaryTemplateComponent } from '@shared/components';

describe('MandateSummaryTemplateComponent', () => {
  let component: MandateSummaryTemplateComponent;
  let fixture: ComponentFixture<MandateSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<MandateSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('wizardStep', {});
    fixture.componentRef.setInput('isEditable', true);
    fixture.componentRef.setInput('mandate', {
      exist: false,
    });
    fixture.componentRef.setInput('mandateMap', {});

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Has the responsibility for compliance with UK ETS been delegated to you by a registered owner for one or more ships?',
      'No',
      'Change  whether the responsibility for compliance with UK ETS has been delegated by a registered owner for one or more ships',
    ]);
  });
});
