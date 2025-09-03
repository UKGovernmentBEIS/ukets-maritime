import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthStore } from '@netz/common/auth';
import { BasePage } from '@netz/common/testing';

import { mockNonComplianceCivilPenaltyUpload, mockNonComplianceFiles } from '@requests/common/non-compliance/testing';
import { NonComplianceCivilPenaltyUploadSummaryTemplateComponent } from '@shared/components/summaries';

describe('NonComplianceCivilPenaltyUploadSummaryTemplateComponent', () => {
  let component: NonComplianceCivilPenaltyUploadSummaryTemplateComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyUploadSummaryTemplateComponent>;
  let page: Page;
  let authStore: AuthStore;

  class Page extends BasePage<NonComplianceCivilPenaltyUploadSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyUploadSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      ...authStore.state.userState,
      roleType: 'REGULATOR',
      userId: 'regTestId',
      status: 'ENABLED',
    });

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyUploadSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockNonComplianceCivilPenaltyUpload);
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
      'Final penalty amount',
      '£50.01',
      'Change',
      'Date by which the penalty must be paid',
      '21 Jun 2026',
      'Change',
      'Your comments',
      'GG',
      'Change',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Uploaded file',
      'just-a-filename.jpg',
      'Final penalty amount',
      '£50.01',
      'Date by which the penalty must be paid',
      '21 Jun 2026',
      'Your comments',
      'GG',
    ]);
  });
});
