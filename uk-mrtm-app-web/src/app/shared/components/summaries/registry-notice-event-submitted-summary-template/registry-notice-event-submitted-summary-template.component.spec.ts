import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { RegistryNoticeEventSubmittedSummaryTemplateComponent } from '@shared/components/summaries/registry-notice-event-submitted-summary-template';
import { RegistryNoticeEventSubmittedDto } from '@shared/types';

describe('RegistryNoticeEventSubmittedSummaryTemplateComponent', () => {
  class Page extends BasePage<RegistryNoticeEventSubmittedSummaryTemplateComponent> {}
  let component: RegistryNoticeEventSubmittedSummaryTemplateComponent;
  let fixture: ComponentFixture<RegistryNoticeEventSubmittedSummaryTemplateComponent>;
  let page: Page;

  const mockRegistryNoticeEventSubmittedDto: RegistryNoticeEventSubmittedDto = {
    payloadType: 'REGISTRY_REGULATOR_NOTICE_EVENT_SUBMITTED',
    registryId: 123456,
    type: 'ACCOUNT_CLOSED',
    officialNotice: {
      downloadUrl: '/api/files/<file-id>/download',
      fileName: 'official-notice.pdf',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryNoticeEventSubmittedSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryNoticeEventSubmittedSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockRegistryNoticeEventSubmittedDto);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'UK ETS Registry ID',
      '123456',
      'Notification type',
      'Account closed',
      'Notification',
      'official-notice.pdf',
    ]);
  });
});
