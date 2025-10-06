import { EmpRegisteredOwner } from '@mrtm/api';

export interface MandateRegisteredOwnerTableListItem extends EmpRegisteredOwner {
  actions?: boolean;
  needsReview?: boolean;
}
