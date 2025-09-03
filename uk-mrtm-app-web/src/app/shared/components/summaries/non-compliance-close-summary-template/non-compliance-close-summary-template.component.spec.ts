import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { mockNonComplianceFiles } from '@requests/common/non-compliance/testing';
import { NonComplianceCloseSummaryTemplateComponent } from '@shared/components';

describe('NonComplianceCloseSummaryTemplateComponent', () => {
  let component: NonComplianceCloseSummaryTemplateComponent;
  let fixture: ComponentFixture<NonComplianceCloseSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceCloseSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCloseSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceCloseSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reason', 'Lorem ipsum');
    fixture.componentRef.setInput('files', mockNonComplianceFiles);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Why have you decided to close this task',
      'Lorem ipsum',
      'Supporting documents',
      'just-a-filename.jpg',
    ]);
  });
});
