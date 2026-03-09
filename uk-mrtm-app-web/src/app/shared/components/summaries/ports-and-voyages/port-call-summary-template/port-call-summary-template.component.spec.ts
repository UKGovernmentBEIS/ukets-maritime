import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCallSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/port-call-summary-template';

describe('PortCallSummaryTemplateComponent', () => {
  let component: PortCallSummaryTemplateComponent;
  let fixture: ComponentFixture<PortCallSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortCallSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PortCallSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
