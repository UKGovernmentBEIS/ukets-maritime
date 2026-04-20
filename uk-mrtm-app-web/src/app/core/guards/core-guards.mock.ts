import { KeycloakService } from 'keycloak-angular';

import { AuthoritiesService, TermsAndConditionsService, UsersService } from '@mrtm/api';

import { AuthService } from '@core/services/auth.service';
import Mock = jest.Mock;

export const mockKeycloakService: Partial<Record<keyof KeycloakService, Mock>> = {
  login: jest.fn(),
  logout: jest.fn(),
  isLoggedIn: jest.fn(),
  loadUserProfile: jest.fn(),
};

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
