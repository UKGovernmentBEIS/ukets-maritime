import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { AerReInitiateSuccessComponent } from '@requests/workflows/create-action/aer-re-initiate/aer-re-initiate-success';

describe('AerReInitiateSuccessComponent', () => {
  let component: AerReInitiateSuccessComponent;
  let fixture: ComponentFixture<AerReInitiateSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerReInitiateSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(AerReInitiateSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
