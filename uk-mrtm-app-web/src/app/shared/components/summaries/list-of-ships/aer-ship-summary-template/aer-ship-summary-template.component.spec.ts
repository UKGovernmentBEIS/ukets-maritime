import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerShipSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/aer-ship-summary-template/aer-ship-summary-template.component';

describe('AerShipSummaryTemplateComponent', () => {
  let component: AerShipSummaryTemplateComponent;
  let fixture: ComponentFixture<AerShipSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerShipSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerShipSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
