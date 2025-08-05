import { RequestDetailsDTO } from '@mrtm/api';

export type MrtmRequestStatus =
  | RequestDetailsDTO['requestStatus']
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'WITHDRAWN'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLOSED'
  | 'MIGRATED'
  | 'EXEMPT';
