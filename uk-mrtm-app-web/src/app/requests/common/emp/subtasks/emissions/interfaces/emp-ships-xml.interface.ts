import {
  CaptureAndStorageAppliedEnum,
  EmissionSourceClassCodeEnum,
  EmissionSourceTypeCodeEnum,
  FactorReferenceCodeEnum,
  FlagEnum,
  FuelOriginCodeEnum,
  FuelTypeCodeEnum,
  GhgCodeEnum,
  IceClassPolarCodeEnum,
  LevelOfUncertaintyTypeCodeEnum,
  MethodDensityBunkerCodeEnum,
  MethodDensityTankCodeEnum,
  MonitoringMethodCodeEnum,
  NatureEnum,
  ShipTypeEnum,
  UseOfDerogationCodeEnum,
} from '@requests/common/types';

export interface EmpShipsXML {
  shipParticularsList: ShipParticularsListDTO;
}

export interface ShipParticularsListDTO {
  shipParticulars: ShipParticularsDTO[];
}

export interface ShipUpdateDTO {
  shipImoNumber: string; // Pattern: [0-9]{7}
  name: string; // MaxLength: 255
  shipType: ShipTypeEnum;
  grossTonnage?: number; // Min: 5000, Max: 999999999
  flag?: FlagEnum;
  iceClassPolarCode?: IceClassPolarCodeEnum;
}

export interface ShipParticularsDTO extends ShipUpdateDTO {
  conditionsOfExemption?: ConditionsOfExemptionDTO;
  ccsCcu?: CcsCcuDTO;
  company?: CompanyDTO;
  monitoringPlan?: MonitoringPlanDetailsDTO;
  measuringEquipment?: MeasuringEquipmentSection;
}

export interface ConditionsOfExemptionDTO {
  useOfDerogationCode?: UseOfDerogationCodeEnum;
  minimumNumberOfVoyages?: number;
}

export interface CcsCcuDTO {
  captureAndStorageApplied?: CaptureAndStorageAppliedEnum;
  technology?: string;
  emissionSourceName?: string[];
}

export interface CompanyDTO {
  nature?: NatureEnum;
}

export interface MonitoringPlanDetailsDTO {
  fuelTypes?: FuelTypeEmissionFactorSection;
  emissionSources?: EmissionSourcesSection;
  monitoringMethods?: MonitoringMethodsSection;
}

export interface FuelTypeEmissionFactorSection {
  fuelTypeEntry?: FuelTypeEmissionFactorEditDTO[];
}

export interface FuelTypeEmissionFactorEditDTO {
  otherFuelType?: string;
  fuelOriginCode?: FuelOriginCodeEnum;
  fuelTypeCode?: FuelTypeCodeEnum;
  methodDensityBunkerCode?: MethodDensityBunkerCodeEnum;
  methodDensityTankCode?: MethodDensityTankCodeEnum;
  emissionFactors?: EmissionFactorDTO[];
}

export interface EmissionFactorDTO {
  factorReferenceCode?: FactorReferenceCodeEnum;
  ghgCode?: GhgCodeEnum;
  ttwEF?: string;
}

export interface EmissionSourcesSection {
  emissionSourceEntry?: EmissionSourceEditDTO[];
}

export interface EmissionSourceEditDTO {
  identificationNumber?: string;
  name?: string; // MaxLength: 255
  emissionSourceTypeCode?: EmissionSourceTypeCodeEnum;
  emissionSourceClassCode?: EmissionSourceClassCodeEnum;
  monitoringMethodCode?: MonitoringMethodCodeEnum[];
  fuelTypeCodes?: FuelTypeCodeDTO[];
}

export interface FuelTypeCodeDTO {
  fuelTypeCode?: FuelTypeCodeEnum;
  otherFuelType?: string;
  slipPercentage?: number; // Min: 0.000, Max: 1.000
}

export interface MonitoringMethodsSection {
  monitoringMethodEntry?: MonitoringMethodEntryDTO[];
}

export interface MonitoringMethodEntryDTO {
  monitoringMethodCode?: MonitoringMethodCodeEnum;
  levelOfUncertaintyTypeCode?: LevelOfUncertaintyTypeCodeEnum;
  shipSpecificUncertainty?: string;
}

export interface MeasuringEquipmentSection {
  measuringEquipmentEntry?: MeasuringEquipmentEditDTO[];
}

export interface MeasuringEquipmentEditDTO {
  name?: string;
  appliedToCode?: string[];
}
