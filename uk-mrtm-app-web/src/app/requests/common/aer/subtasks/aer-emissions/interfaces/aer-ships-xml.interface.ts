import {
  EmissionSourceClassCodeEnum,
  EmissionSourceTypeCodeEnum,
  FactorReferenceCodeEnum,
  FlagEnum,
  FuelOriginCodeEnum,
  FuelTypeCodeEnum,
  GhgCodeEnum,
  IceClassPolarCodeEnum,
  LevelOfUncertaintyTypeCodeEnum,
  MonitoringMethodCodeEnum,
  NatureEnum,
  ShipTypeEnum,
} from '@requests/common/types';

export interface AerShipsXML {
  emissionReportsList: EmissionReportDetailsListDTO;
}

export interface EmissionReportDetailsListDTO {
  emissionReport: EmissionReportDetailsDTO[];
}

export interface ShipUpdateDTO {
  shipImoNumber: string;
  name: string;
  shipType: ShipTypeEnum;
  grossTonnage?: number;
  flag?: FlagEnum;
  iceClassPolarCode?: IceClassPolarCodeEnum;
  allYear?: boolean;
  partialPeriodFromDate?: string;
  partialPeriodToDate?: string;
}

export interface EmissionReportDetailsDTO extends ShipUpdateDTO {
  company?: CompanyUpdateDTO;
  fuelTypes?: ErFuelTypeEmissionFactorSection;
  emissionSources?: ErEmissionSourcesSection;
  monitoringMethods?: MonitoringMethodsSection;
  additionalInformation?: AdditionalInformationDTO;
}

export interface CompanyUpdateDTO {
  nature?: NatureEnum;
}

export interface EmissionFactorDTO {
  factorReferenceCode?: FactorReferenceCodeEnum;
  ghgCode?: GhgCodeEnum;
  ttwEF?: string;
}

export interface FuelTypeEmissionFactorEditDTO {
  otherFuelType?: string;
  fuelOriginCode?: FuelOriginCodeEnum;
  fuelTypeCode?: FuelTypeCodeEnum;
  emissionFactors?: EmissionFactorDTO[];
}

export interface ErFuelTypeEmissionFactorSection {
  fuelTypeEntry?: FuelTypeEmissionFactorEditDTO[];
}

export interface EmissionSourceEditDTO {
  name?: string;
  emissionSourceTypeCode?: EmissionSourceTypeCodeEnum;
  emissionSourceClassCode?: EmissionSourceClassCodeEnum;
  monitoringMethodCode?: MonitoringMethodCodeEnum[];
  fuelTypeCodes?: FuelTypeCodeDTO[];
}

export interface FuelTypeCodeDTO {
  fuelTypeCode?: FuelTypeCodeEnum;
  otherFuelType?: string;
  slipPercentage?: number; // MinInclusive: 0.000, MaxInclusive: 1.000
}

export interface ErEmissionSourcesSection {
  emissionSourceEntry?: EmissionSourceEditDTO[];
}

export interface MonitoringMethodEntryDTO {
  monitoringMethodCode?: MonitoringMethodCodeEnum;
  levelOfUncertaintyTypeCode?: LevelOfUncertaintyTypeCodeEnum;
  shipSpecificUncertainty?: string;
}

export interface MonitoringMethodsSection {
  monitoringMethodEntry?: MonitoringMethodEntryDTO[];
}

export interface AdditionalInformationDTO {
  exemptionPerVoyageMonitoring?: boolean;
}
