import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatedDataListSummaryTemplateComponent } from '@shared/components/summaries/aggregated-data/aggregated-data-list-summary-template/aggregated-data-list-summary-template.component';

describe('AggregatedDataListSummaryTemplateComponent', () => {
  let component: AggregatedDataListSummaryTemplateComponent;
  let fixture: ComponentFixture<AggregatedDataListSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregatedDataListSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AggregatedDataListSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
