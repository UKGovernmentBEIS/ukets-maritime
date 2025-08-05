import {
  AerBioFuels,
  AerEFuels,
  AerFossilFuels,
  EmpBioFuels,
  EmpEFuels,
  EmpFossilFuels,
  FuelOriginBiofuelTypeName,
  FuelOriginEFuelTypeName,
  FuelOriginFossilTypeName,
} from '@mrtm/api';

export type BioFuels = EmpBioFuels | AerBioFuels;
export type EFuels = EmpEFuels | AerEFuels;
export type FossilFuels = EmpFossilFuels | AerFossilFuels;

export type AllFuels = BioFuels | EFuels | FossilFuels;

export type FuelType = FossilFuels['type'] | BioFuels['type'] | EFuels['type'];

export type AllFuelOriginTypeName = FuelOriginBiofuelTypeName | FuelOriginEFuelTypeName | FuelOriginFossilTypeName;

export type AerFuel = AerFossilFuels | AerBioFuels | AerEFuels;
