import { AerPort, AerPortDetails, AerPortVisit } from '@mrtm/api';

export interface AerPortUploadCsvDto {
  imoNumber: AerPort['imoNumber'];
  country: AerPortVisit['country'];
  port: AerPortVisit['port'];
  arrivalTime: AerPortDetails['arrivalTime'];
  departureTime: AerPortDetails['departureTime'];
}
