import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { ForgotPasswordService } from '@mrtm/api';

import { ErrorCodes, PageNotFoundComponent } from '@netz/common/error';
import { BasePage, mockClass, MockType } from '@netz/common/testing';

import { ResetPasswordComponent } from '@forgot-password/reset-password/reset-password.component';
import { ResetPasswordStore } from '@forgot-password/store/reset-password.store';
import { PasswordService } from '@shared/services';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let page: Page;
  let router: Router;
  let passwordService: jest.Mocked<PasswordService>;
  let resetPasswordStore: ResetPasswordStore;

  class Page extends BasePage<ResetPasswordComponent> {
    get passwordValue() {
      return this.getInputValue('#password');
    }

    set passwordValue(password: string) {
      this.setInputValue('#password', password);
    }

    get repeatedPasswordValue() {
      return this.query<HTMLInputElement>('#validatePassword').value;
    }

    set repeatedPasswordValue(password: string) {
      this.setInputValue('#validatePassword', password);
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const forgotPasswordService: MockType<ForgotPasswordService> = {
    verifyToken: jest.fn().mockReturnValue(of(null)),
  };

  beforeEach(async () => {
    passwordService = mockClass(PasswordService);
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'error/404', component: PageNotFoundComponent },
          { path: '', component: ResetPasswordComponent },
          { path: '**', redirectTo: '' },
        ]),
        ResetPasswordStore,
        { provide: ForgotPasswordService, useValue: forgotPasswordService },
        { provide: PasswordService, useValue: passwordService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    passwordService.isBlacklistedPassword.mockReturnValue(of(false));
    resetPasswordStore = TestBed.inject(ResetPasswordStore);

    resetPasswordStore.setState({
      ...resetPasswordStore.getState(),
      password: 'password',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get password from store', () => {
    forgotPasswordService.verifyToken.mockReturnValue(of({ email: 'test@mail.com' } as any));

    component.ngOnInit();
    fixture.detectChanges();
    expect(page.passwordValue).toEqual('password');
    expect(page.repeatedPasswordValue).toEqual('password');
  });

  it('should submit only if form valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

    page.passwordValue = '';
    page.repeatedPasswordValue = '';
    page.submitButton.click();
    fixture.detectChanges();

    page.passwordValue = 'test';
    page.submitButton.click();
    fixture.detectChanges();
    expect(navigateSpy).not.toHaveBeenCalled();

    fixture.componentInstance.form.controls['password'].clearAsyncValidators();
    page.passwordValue = 'ThisIsAStrongP@ssw0rd';
    page.repeatedPasswordValue = 'ThisIsAStrongP@ssw0rd';

    page.submitButton.click();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should navigate to appropriate page if there is an error', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    forgotPasswordService.verifyToken.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: ErrorCodes.EMAIL1001 } })),
    );

    component.ngOnInit();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['forgot-password', 'invalid-link']);

    forgotPasswordService.verifyToken.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: ErrorCodes.TOKEN1001 } })),
    );

    component.ngOnInit();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith(['error', '404']);
  });
});
