import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { FollowUpResponseRegulatorSummaryTemplateComponent } from '@shared/components';

describe('FollowUpResponseRegulatorSummaryTemplateComponent', () => {
  let component: FollowUpResponseRegulatorSummaryTemplateComponent;
  let fixture: ComponentFixture<FollowUpResponseRegulatorSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<FollowUpResponseRegulatorSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpResponseRegulatorSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowUpResponseRegulatorSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.followUpResponseDTO = {
      followUpRequest: 'some changes here',
      followUpResponseExpirationDate: '2026-01-01',
      submissionDate: '2024-10-01',
      followUpResponse: 'Some response',
      attachments: [
        { downloadUrl: '/tasks/1/file-download/11111111-1111-4111-a111-111111111111', fileName: '1.png' },
        { downloadUrl: '/tasks/1/file-download/22222222-2222-4222-a222-222222222222', fileName: '2.png' },
      ],
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Request from the regulator',
      'some changes here',
      'Due date',
      '1 Jan 2026',
      'Submission date',
      '1 Oct 2024',
      "Operator's response",
      'Some response',
      'Supporting documents',
      '1.png2.png',
    ]);
  });
});
