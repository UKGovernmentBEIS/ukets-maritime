import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { VoyageOrPortCallEmissionsSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/voyage-or-port-call-emissions-summary-template';

describe('VoyageOrPortCallEmissionsSummaryTemplateComponent', () => {
  let component: VoyageOrPortCallEmissionsSummaryTemplateComponent;
  let fixture: ComponentFixture<VoyageOrPortCallEmissionsSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyageOrPortCallEmissionsSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(VoyageOrPortCallEmissionsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
