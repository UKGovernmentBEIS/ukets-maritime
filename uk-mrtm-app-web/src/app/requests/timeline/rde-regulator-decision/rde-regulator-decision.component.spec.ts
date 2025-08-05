import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { RdeRegulatorDecisionComponent } from '@requests/timeline/rde-regulator-decision/rde-regulator-decision.component';

describe('RdeRegulatorDecisionComponent', () => {
  let component: RdeRegulatorDecisionComponent;
  let fixture: ComponentFixture<RdeRegulatorDecisionComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdeRegulatorDecisionComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(RdeRegulatorDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
