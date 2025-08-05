import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { RfiRdeCancelSuccessComponent } from '@requests/common/components/rfi-rde-cancel-success/rfi-rde-cancel-success.component';

describe('RfiRdeCancelSuccessComponent', () => {
  let component: RfiRdeCancelSuccessComponent;
  let fixture: ComponentFixture<RfiRdeCancelSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfiRdeCancelSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RfiRdeCancelSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
