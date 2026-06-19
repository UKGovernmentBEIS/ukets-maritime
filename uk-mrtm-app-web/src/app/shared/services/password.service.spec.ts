import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { firstValueFrom } from 'rxjs';

import { PasswordService } from '@shared/services';
import { webcrypto } from 'node:crypto';

const mockResponse = '1E4C9B93F3F0682250B6CF8331B7EE68FD8:3759315';

describe('PasswordService', () => {
  let service: PasswordService;
  let httpTestingController: HttpTestingController;

  if (Object.keys(window.crypto).length === 0) {
    Object.defineProperty(window, 'crypto', {
      value: webcrypto,
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PasswordService],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PasswordService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should blacklist password', async () => {
    const promise = firstValueFrom(service.isBlacklistedPassword('password'));

    // Wait for crypto
    await new Promise((resolve) => setTimeout(resolve, 10));

    const req = httpTestingController.expectOne('https://api.pwnedpasswords.com/range/5baa6');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toBeTruthy();
  });

  it('should return blacklisted error if the password does not pass validation', async () => {
    const formControl = new FormControl('password', [], [(control) => service.blacklisted(control)]);
    formControl.updateValueAndValidity();

    // Wait for crypto and debounce
    await new Promise((resolve) => setTimeout(resolve, 10));

    const req = httpTestingController.expectOne('https://api.pwnedpasswords.com/range/5baa6');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    // Wait for final map
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(formControl.errors.blacklisted).toBeTruthy();
  });

  it('should return strong error if the password is not strong', () => {
    const formControl = new FormControl('password', [(control) => service.strong(control)]);
    formControl.updateValueAndValidity();

    expect(formControl.errors.weakPassword).toBeTruthy();
  });
});
