import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { MandateResponsibilitySummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-summary-template/mandate-responsibility-summary-template.component';
import { HTML_DIFF } from '@shared/directives';

describe('MandateResponsibilitySummaryTemplateComponent', () => {
  let component: MandateResponsibilitySummaryTemplateComponent;
  let fixture: ComponentFixture<MandateResponsibilitySummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<MandateResponsibilitySummaryTemplateComponent> {}
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateResponsibilitySummaryTemplateComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: HTML_DIFF, useValue: true },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateResponsibilitySummaryTemplateComponent);
    fixture.componentRef.setInput('mandate', {
      exist: false,
    });
    fixture.componentRef.setInput('originalMandate', {
      exist: true,
    });
    fixture.componentRef.setInput('isEditable', true);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summariesContents).toEqual([
      'Has the responsibility for compliance with UK ETS been delegated to you by a registered owner for one or more ships?',
      'YesNo',
      'Change',
    ]);
  });
});
