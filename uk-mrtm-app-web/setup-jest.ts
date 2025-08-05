// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import './jest-global-mocks';
import '@testing-library/jest-dom';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
