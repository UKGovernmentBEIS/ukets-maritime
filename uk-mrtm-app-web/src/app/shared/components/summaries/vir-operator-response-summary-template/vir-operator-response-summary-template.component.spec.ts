import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirOperatorResponseSummaryTemplateComponent } from '@shared/components/summaries/vir-operator-response-summary-template/vir-operator-response-summary-template.component';

describe('VirOperatorResponseSummaryTemplateComponent', () => {
  let component: VirOperatorResponseSummaryTemplateComponent;
  let fixture: ComponentFixture<VirOperatorResponseSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirOperatorResponseSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirOperatorResponseSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
