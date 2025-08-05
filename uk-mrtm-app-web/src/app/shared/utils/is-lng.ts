import { AllFuelOriginTypeName } from '@shared/types';

export const isLNG = (fuel: AllFuelOriginTypeName): boolean => {
  return fuel?.type === 'LNG' || fuel?.type === 'E_LNG' || fuel?.type === 'BIO_LNG' || fuel?.type === 'OTHER';
};
