import { FuelOriginCodeEnum, FuelTypeCodeEnum } from '@requests/common/types';

export interface AerAggregatedDataXML {
  emissions: EmissionDetailsListDTO;
}

export interface EmissionDetailsListDTO {
  shipEmissions: EmissionDetailsDTO[];
}

export interface EmissionDetailsDTO {
  shipImoNumber: string;
  annualEmission: AnnualEmissionEditDTO;
}

export interface AnnualEmissionEditDTO {
  emissions: AnnualConsumptionEditDTO[];
  etsEmissionsWithinUkPort: EmissionsGroupDTO;
  etsEmissionsBetweenUkPort: EmissionsGroupDTO;
  etsEmissionsBetweenUkAndNiPort: EmissionsGroupDTO;
}

export interface AnnualConsumptionEditDTO {
  fuelOriginCode: FuelOriginCodeEnum;
  fuelTypeCode: FuelTypeCodeEnum;
  amount: number;
  otherFuelType?: string;
}

export interface EmissionsGroupDTO {
  tco2Total: number;
  tch4eqTotal: number;
  tn2oeqTotal: number;
}
