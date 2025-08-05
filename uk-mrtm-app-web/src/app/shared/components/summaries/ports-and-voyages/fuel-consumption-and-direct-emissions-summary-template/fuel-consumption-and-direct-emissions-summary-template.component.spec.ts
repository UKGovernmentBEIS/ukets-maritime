import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { FuelConsumptionAndDirectEmissionsSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/fuel-consumption-and-direct-emissions-summary-template/fuel-consumption-and-direct-emissions-summary-template.component';

describe('FuelConsumptionAndDirectEmissionsSummaryTemplateComponent', () => {
  let component: FuelConsumptionAndDirectEmissionsSummaryTemplateComponent;
  let fixture: ComponentFixture<FuelConsumptionAndDirectEmissionsSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelConsumptionAndDirectEmissionsSummaryTemplateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FuelConsumptionAndDirectEmissionsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
