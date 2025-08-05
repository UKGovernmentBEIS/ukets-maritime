import { AerPortVisit, AerVoyage, AerVoyageDetails } from '@mrtm/api';

export interface AerVoyageUploadCsvDto {
  imoNumber: AerVoyage['imoNumber'];
  departurePort: AerPortVisit['port'];
  departureTime: AerVoyageDetails['departureTime'];
  arrivalPort: AerPortVisit['port'];
  arrivalTime: AerVoyageDetails['arrivalTime'];
}
