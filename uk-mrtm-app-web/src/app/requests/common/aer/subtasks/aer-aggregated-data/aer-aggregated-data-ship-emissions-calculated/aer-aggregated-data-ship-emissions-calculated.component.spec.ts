import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { AerAggregatedDataShipEmissionsCalculatedComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-ship-emissions-calculated/aer-aggregated-data-ship-emissions-calculated.component';

describe('AerAggregatedDataShipEmissionsCalculatedComponent', () => {
  let component: AerAggregatedDataShipEmissionsCalculatedComponent;
  let fixture: ComponentFixture<AerAggregatedDataShipEmissionsCalculatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataShipEmissionsCalculatedComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(AerAggregatedDataShipEmissionsCalculatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
