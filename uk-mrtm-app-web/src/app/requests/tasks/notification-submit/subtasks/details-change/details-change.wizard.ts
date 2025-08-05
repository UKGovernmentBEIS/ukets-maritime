import { EmpNotificationDetailsOfChange } from '@mrtm/api';

export const isWizardCompleted = (detailsOfChange: EmpNotificationDetailsOfChange) =>
  !!detailsOfChange?.description?.trim()?.length && !!detailsOfChange?.justification?.trim()?.length;
