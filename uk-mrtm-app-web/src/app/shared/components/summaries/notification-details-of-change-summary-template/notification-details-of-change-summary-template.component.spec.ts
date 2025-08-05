import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { NotificationDetailsOfChangeSummaryTemplateComponent } from '@shared/components';

describe('NotificationDetailsOfChangeSummaryTemplateComponent', () => {
  let component: NotificationDetailsOfChangeSummaryTemplateComponent;
  let fixture: ComponentFixture<NotificationDetailsOfChangeSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<NotificationDetailsOfChangeSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDetailsOfChangeSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationDetailsOfChangeSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.detailsOfChange = {
      description: 'description the non-significant change',
      justification: 'some justification',
      startDate: '2020-04-01',
      endDate: '2023-03-01',
      documents: [
        '11111111-1111-4111-a111-111111111111',
        '22222222-2222-4222-a222-222222222222',
        '33333333-3333-4333-a333-333333333333',
      ],
    };
    component.notificationFiles = [
      {
        downloadUrl: '/tasks/61/file-download/11111111-1111-4111-a111-111111111111',
        fileName: '1.png',
      },
      {
        downloadUrl: '/tasks/61/file-download/22222222-2222-4222-a222-222222222222',
        fileName: '2.png',
      },
      {
        downloadUrl: '/tasks/61/file-download/33333333-3333-4333-a333-333333333333',
        fileName: '3.png',
      },
    ];
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Describe the non-significant change',
      'description the non-significant change',
      'Justification for not submitting a variation',
      'some justification',
      'Uploaded files',
      '1.png2.png3.png',
      'Provide the start date of the non-significant change',
      '1 Apr 2020',
      'Provide the end date of the non-significant change',
      '1 Mar 2023',
    ]);
  });
});
