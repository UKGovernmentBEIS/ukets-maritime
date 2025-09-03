import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceCloseSuccessComponent } from '@requests/common/non-compliance/non-compliance-close/components/non-compliance-close-success/non-compliance-close-success.component';

describe('NonComplianceCloseSuccessComponent', () => {
  let component: NonComplianceCloseSuccessComponent;
  let fixture: ComponentFixture<NonComplianceCloseSuccessComponent>;
  const activatedRouteMock = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCloseSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceCloseSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
