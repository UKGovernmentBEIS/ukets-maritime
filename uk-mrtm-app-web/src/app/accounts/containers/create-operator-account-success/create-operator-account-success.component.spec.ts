import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { CreateOperatorAccountSuccessComponent } from '@accounts/containers/create-operator-account-success/create-operator-account-success.component';

describe('CreateOperatorAccountSuccessComponent', () => {
  let component: CreateOperatorAccountSuccessComponent;
  let fixture: ComponentFixture<CreateOperatorAccountSuccessComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOperatorAccountSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOperatorAccountSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
