import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { OperatorUsersInvitationService, OperatorUsersService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { CreateUserAuthoritySuccessComponent } from '@accounts/containers/create-user-authority-success/create-user-authority-success.component';

describe('CreateUserAuthoritySuccessComponent', () => {
  let component: CreateUserAuthoritySuccessComponent;
  let fixture: ComponentFixture<CreateUserAuthoritySuccessComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserAuthoritySuccessComponent],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: OperatorUsersInvitationService, useValue: mockClass(OperatorUsersInvitationService) },
        { provide: OperatorUsersService, useValue: mockClass(OperatorUsersService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserAuthoritySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
