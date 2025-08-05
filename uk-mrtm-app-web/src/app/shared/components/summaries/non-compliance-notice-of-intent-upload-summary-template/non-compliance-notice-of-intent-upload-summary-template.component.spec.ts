import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { mockNonComplianceFiles } from '@requests/common/non-compliance/testing';
import { NonComplianceNoticeOfIntentUploadSummaryTemplateComponent } from '@shared/components/summaries';

describe('NonComplianceNoticeOfIntentUploadSummaryTemplateComponent', () => {
  let component: NonComplianceNoticeOfIntentUploadSummaryTemplateComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentUploadSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceNoticeOfIntentUploadSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentUploadSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentUploadSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      noticeOfIntent: '66b0ddb3-dc64-4ea3-8a68-0afa59128e99',
      comments: 'GG',
      nonComplianceAttachments: {
        '66b0ddb3-dc64-4ea3-8a68-0afa59128e99': 'just-a-filename.jpg',
      },
    });
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
