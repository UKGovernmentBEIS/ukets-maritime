import { AerShipAggregatedDataSave, AerShipDetails } from '@mrtm/api';

export interface AerAggregatedDataUploadDto {
  imoNumber: AerShipAggregatedDataSave['imoNumber'];
  name: AerShipDetails['name'];
}
