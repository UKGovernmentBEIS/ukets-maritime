import { AerDataInitialSourceType } from '@shared/types/aer-data-initial-source-type.enum';
import { ShipEmissionTableListItem } from '@shared/types/ship-emission-table-list-item.interface';

export interface AerShipEmissionTableListItem extends ShipEmissionTableListItem {
  dataInputType?: AerDataInitialSourceType;
}
