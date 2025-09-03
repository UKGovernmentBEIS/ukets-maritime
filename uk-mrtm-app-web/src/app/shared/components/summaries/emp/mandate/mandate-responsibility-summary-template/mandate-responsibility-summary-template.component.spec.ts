import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateResponsibilitySummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-summary-template/mandate-responsibility-summary-template.component';

describe('MandateResponsibilitySummaryTemplateComponent', () => {
  let component: MandateResponsibilitySummaryTemplateComponent;
  let fixture: ComponentFixture<MandateResponsibilitySummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateResponsibilitySummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateResponsibilitySummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
