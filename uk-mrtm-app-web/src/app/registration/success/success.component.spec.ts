import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OperatorUserDTO } from '@mrtm/api';

import { mockClass } from '@netz/common/testing';

import { AuthService } from '@core/services/auth.service';
import { initialState } from '@registration/store/user-registration.state';
import { UserRegistrationStore } from '@registration/store/user-registration.store';
import { SuccessComponent } from '@registration/success/success.component';
import { KeycloakService } from '@shared/services';

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  const mockUserOperatorDTO: OperatorUserDTO = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@email.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockClass(AuthService) },
        { provide: KeycloakService, useValue: mockClass(KeycloakService) },
      ],
    }).compileComponents();

    TestBed.inject(UserRegistrationStore).setState({
      isInvited: true,
      userRegistrationDTO: mockUserOperatorDTO,
      password: 'asdfg',
      token: 'token',
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the store', () => {
    expect(TestBed.inject(UserRegistrationStore).getState()).toEqual(initialState);
  });
});
