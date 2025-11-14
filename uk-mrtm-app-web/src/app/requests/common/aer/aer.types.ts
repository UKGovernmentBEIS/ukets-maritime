import {
  AerApplicationSubmitRequestTaskPayload,
  AerApplicationVerificationSubmitRequestTaskPayload,
  AerFuelConsumption,
  AerPort,
  AerPortEmissionsMeasurement,
  AerPortVisit,
  AerShipEmissions,
  AerVerificationTeamDetails,
  AerVerifierContact,
  AerVoyage,
  FuelOriginTypeName,
  VerificationBodyDetails,
} from '@mrtm/api';

import { AER_SITE_VISIT_TYPES } from '@requests/common/aer/aer.consts';
import { AerJourneyTypeEnum, AllFuelOriginTypeName } from '@shared/types';

export type AerCommonTaskPayload = Pick<
  AerSubmitTaskPayload | AerVerificationSubmitTaskPayload,
  | 'payloadType'
  | 'reportingYear'
  | 'aerAttachments'
  | 'aerSectionsCompleted'
  | 'verificationSectionsCompleted'
  | 'reportingRequired'
  | 'reportingObligationDetails'
  | 'aer'
  | 'aerMonitoringPlanVersion'
>;

export type AerSubmitTaskPayload = AerApplicationSubmitRequestTaskPayload;

export type AerVerificationSubmitTaskPayload = AerApplicationVerificationSubmitRequestTaskPayload;

export type AerSiteVisitType = (typeof AER_SITE_VISIT_TYPES)[number];

export interface AerVoyageItem extends AerVoyage {
  journeyType?: AerJourneyTypeEnum;
  relatedShip?: AerShipEmissions;
}

export interface AerVerifierDetails {
  verificationBodyId: number;
  verificationBodyDetails: VerificationBodyDetails;
  verifierContact: AerVerifierContact;
  verificationTeamDetails: AerVerificationTeamDetails;
}

export interface FlattenedVoyage {
  imoNumber: AerVoyage['imoNumber'];
  departureCountry: AerPortVisit['country'];
  departurePort: AerPortVisit['port'];
  departureDate: string;
  departureActualTime: string;
  arrivalCountry: AerPortVisit['country'];
  arrivalPort: AerPortVisit['port'];
  arrivalDate: string;
  arrivalActualTime: string;
  fuelConsumptionOrigin: FuelOriginTypeName['origin'];
  fuelConsumptionType: AllFuelOriginTypeName;
  fuelConsumptionOtherName: FuelOriginTypeName['name'];
  fuelConsumptionEmissionSourceName: AerFuelConsumption['name'];
  fuelConsumptionMethaneSlip: FuelOriginTypeName['methaneSlip'];
  fuelConsumptionAmount: AerFuelConsumption['amount'];
  fuelConsumptionMeasuringUnit: AerFuelConsumption['measuringUnit'];
  fuelConsumptionFuelDensity: AerFuelConsumption['fuelDensity'];
  directEmissionsCO2: AerPortEmissionsMeasurement['co2'];
  directEmissionsCH4: AerPortEmissionsMeasurement['ch4'];
  directEmissionsN2O: AerPortEmissionsMeasurement['n2o'];
}

export interface FlattenedPort {
  imoNumber: AerPort['imoNumber'];
  visitCountry: AerPortVisit['country'];
  visitPort: AerPortVisit['port'];
  departureDate: string;
  departureActualTime: string;
  arrivalDate: string;
  arrivalActualTime: string;
  fuelConsumptionOrigin: FuelOriginTypeName['origin'];
  fuelConsumptionType: AllFuelOriginTypeName;
  fuelConsumptionOtherName: FuelOriginTypeName['name'];
  fuelConsumptionEmissionSourceName: AerFuelConsumption['name'];
  fuelConsumptionMethaneSlip: FuelOriginTypeName['methaneSlip'];
  fuelConsumptionAmount: AerFuelConsumption['amount'];
  fuelConsumptionMeasuringUnit: AerFuelConsumption['measuringUnit'];
  fuelConsumptionFuelDensity: AerFuelConsumption['fuelDensity'];
  directEmissionsCO2: AerPortEmissionsMeasurement['co2'];
  directEmissionsCH4: AerPortEmissionsMeasurement['ch4'];
  directEmissionsN2O: AerPortEmissionsMeasurement['n2o'];
}
