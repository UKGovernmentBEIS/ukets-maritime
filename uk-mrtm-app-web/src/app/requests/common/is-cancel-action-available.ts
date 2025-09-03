import { RequestTaskDTO } from '@mrtm/api';

const EXCLUDED_TASK_TYPES: Array<RequestTaskDTO['type']> = [
  'DOE_TRACK_PAYMENT',
  'DOE_CONFIRM_PAYMENT',
  'EMP_ISSUANCE_TRACK_PAYMENT',
  'EMP_ISSUANCE_CONFIRM_PAYMENT',
  'EMP_VARIATION_TRACK_PAYMENT',
  'EMP_VARIATION_CONFIRM_PAYMENT',
  'EMP_VARIATION_REGULATOR_LED_TRACK_PAYMENT',
  'EMP_VARIATION_REGULATOR_LED_CONFIRM_PAYMENT',
];

export const isCancelActionAvailable = (requestTaskType: RequestTaskDTO['type']): boolean =>
  !EXCLUDED_TASK_TYPES.includes(requestTaskType);
