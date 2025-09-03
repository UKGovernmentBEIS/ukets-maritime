import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateResponsibilityDeclarationSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-declaration-summary-template';

describe('MandateResponsibilityDeclarationSummaryTemplateComponent', () => {
  let component: MandateResponsibilityDeclarationSummaryTemplateComponent;
  let fixture: ComponentFixture<MandateResponsibilityDeclarationSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateResponsibilityDeclarationSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateResponsibilityDeclarationSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
