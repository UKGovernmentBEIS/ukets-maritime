import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import {
  mockNonComplianceFiles,
  mockNonComplianceInitialPenaltyNoticeUpload,
} from '@requests/common/non-compliance/testing';
import { NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent } from '@shared/components/summaries';

describe('NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockNonComplianceInitialPenaltyNoticeUpload);
    fixture.componentRef.setInput('files', mockNonComplianceFiles);
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Uploaded file',
      'just-a-filename.jpg',
      'Change',
      'Your comments',
      'GG',
      'Change',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual(['Uploaded file', 'just-a-filename.jpg', 'Your comments', 'GG']);
  });
});
