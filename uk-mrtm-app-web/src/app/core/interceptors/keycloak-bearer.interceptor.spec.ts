import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { keycloakBearerInterceptor } from '@core/interceptors';
import { KeycloakService } from '@core/services';

describe('keycloakBearerInterceptor', () => {
  let keycloakServiceMock: jest.Mocked<KeycloakService>;

  const interceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) =>
    TestBed.runInInjectionContext(() => keycloakBearerInterceptor(req, next));

  beforeEach(() => {
    keycloakServiceMock = {
      isAuthenticated: true,
      token: 'test-token',
      updateToken: jest.fn().mockResolvedValue(true),
    } as any;

    TestBed.configureTestingModule({
      providers: [{ provide: KeycloakService, useValue: keycloakServiceMock }],
    });
  });

  it('should be created', () => {
    expect(keycloakBearerInterceptor).toBeTruthy();
  });

  it('should add an Authorization header if authenticated and URL is not excluded', (done) => {
    const httpRequest = new HttpRequest('GET', '/test-api');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBe(true);
      expect(req.headers.get('Authorization')).toBe('Bearer test-token');
      return of({} as any);
    };

    interceptor(httpRequest, next).subscribe(() => {
      expect(keycloakServiceMock.updateToken).toHaveBeenCalled();
      done();
    });
  });

  it('should not add an Authorization header if not authenticated', (done) => {
    (keycloakServiceMock as any).isAuthenticated = false;
    const httpRequest = new HttpRequest('GET', '/test-api');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBe(false);
      return of({} as any);
    };

    interceptor(httpRequest, next).subscribe(() => {
      expect(keycloakServiceMock.updateToken).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not add an Authorization header if URL is excluded', (done) => {
    const httpRequest = new HttpRequest('GET', 'https://api.pwnedpasswords.com/range/12345');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBe(false);
      return of({} as any);
    };

    interceptor(httpRequest, next).subscribe(() => {
      expect(keycloakServiceMock.updateToken).not.toHaveBeenCalled();
      done();
    });
  });

  it('should call updateToken with minValidity from environment', (done) => {
    const httpRequest = new HttpRequest('GET', '/test-api');
    const next: HttpHandlerFn = () => of({} as any);

    interceptor(httpRequest, next).subscribe(() => {
      expect(keycloakServiceMock.updateToken).toHaveBeenCalledWith(120);
      done();
    });
  });

  it('should not add Authorization header if token is missing even if authenticated', (done) => {
    (keycloakServiceMock as any).token = undefined;
    const httpRequest = new HttpRequest('GET', '/test-api');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBe(false);
      return of({} as any);
    };

    interceptor(httpRequest, next).subscribe(() => {
      done();
    });
  });
});
