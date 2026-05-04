import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { MandateResponsibilityDeclarationSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-declaration-summary-template';
import { HTML_DIFF } from '@shared/directives';

describe('MandateResponsibilityDeclarationSummaryTemplateComponent', () => {
  let component: MandateResponsibilityDeclarationSummaryTemplateComponent;
  let fixture: ComponentFixture<MandateResponsibilityDeclarationSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<MandateResponsibilityDeclarationSummaryTemplateComponent> {}
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateResponsibilityDeclarationSummaryTemplateComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: HTML_DIFF, useValue: true },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateResponsibilityDeclarationSummaryTemplateComponent);
    fixture.componentRef.setInput('mandate', {
      responsibilityDeclaration: false,
    });
    fixture.componentRef.setInput('originalMandate', {
      responsibilityDeclaration: true,
    });
    fixture.componentRef.setInput('operatorName', 'TEST OPERATOR_2');
    fixture.componentRef.setInput('originalOperatorName', 'TEST OPERATOR');
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
      'Declaration of delegation of UK ETS responsibility',
      'I certify that I am authorised by TEST OPERATOR to make this declaration on its behalf and believe that the information provided is true.',
      'Change declaration of delegation of UK ETS responsibility',
    ]);
  });
});
