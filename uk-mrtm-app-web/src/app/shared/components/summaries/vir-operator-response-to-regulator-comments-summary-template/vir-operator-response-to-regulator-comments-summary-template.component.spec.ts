import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent } from '@shared/components/summaries/vir-operator-response-to-regulator-comments-summary-template';

describe('VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent', () => {
  class Page extends BasePage<VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent> {}
  let component: VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent;
  let fixture: ComponentFixture<VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      improvementCompleted: true,
      dateCompleted: '2024-12-12',
    });
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for completed improvements', () => {
    expect(page.summariesContents).toEqual([
      'Is the required improvement complete?',
      'Yes',
      'Change',
      'When was the improvement completed?',
      '12 Dec 2024',
      'Change',
    ]);
  });

  it('should display all HTML elements for completed improvements', () => {
    fixture.componentRef.setInput('data', {
      improvementCompleted: false,
      reason: 'Some test reason',
    });

    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Is the required improvement complete?',
      'No',
      'Change',
      'Tell us why you have chosen not to address this recommendation',
      'Some test reason',
      'Change',
    ]);
  });
});
