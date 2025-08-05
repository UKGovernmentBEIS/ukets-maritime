import { MrtmRequestStatus } from '@shared/types';

export const empHistoryStatusMap: Record<MrtmRequestStatus, string> = {
  // Values must be in alphabetical order
  APPROVED: 'Approved',
  CANCELLED: 'Cancelled',
  CLOSED: 'Closed',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In progress',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};
