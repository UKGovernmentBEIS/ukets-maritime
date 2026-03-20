import { signal } from '@angular/core';

import { AuthoritiesService, TermsAndConditionsService, UsersService } from '@mrtm/api';

import { AuthService, KeycloakService } from '@core/services';
import Mock = jest.Mock;

export const mockKeycloakService: Record<keyof KeycloakService, any> = {
  login: jest.fn(),
  logout: jest.fn(),
  isLoggedIn: jest.fn(),
  loadUserProfile: jest.fn(),
  init: jest.fn(),
  getKeycloakInstance: jest.fn(),
  getToken: jest.fn(),
  updateToken: jest.fn(),
  getUserProfile: jest.fn(),
  isTokenExpired: jest.fn(),
  getTokenParsed: jest.fn(),
  getRefreshTokenParsed: jest.fn(),
  keycloakEvents: signal(null),
} as any;

export const mockAuthService: Partial<Record<keyof AuthService, Mock>> = {
  checkUser: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  loadUser: jest.fn(),
  loadUserState: jest.fn(),
  loadUserProfile: jest.fn(),
  loadUserTerms: jest.fn(),
  loadIsLoggedIn: jest.fn(),
};

export const mockUsersService: Partial<Record<keyof UsersService, Mock>> = {
  getCurrentUser: jest.fn(),
};

export const mockAuthorityService: Partial<Record<keyof AuthoritiesService, Mock>> = {
  getCurrentUserState: jest.fn(),
};

export const mockTermsAndConditionsService: Partial<Record<keyof TermsAndConditionsService, Mock>> = {
  getLatestTerms: jest.fn(),
};
