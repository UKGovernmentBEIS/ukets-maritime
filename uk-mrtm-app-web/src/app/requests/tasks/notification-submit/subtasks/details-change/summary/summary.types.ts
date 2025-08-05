import { EmissionsMonitoringPlanNotification, EmpNotificationDetailsOfChange } from '@mrtm/api';

import { AttachedFile, SubTaskListMap } from '@shared/types';

export interface SummaryViewModel {
  detailsOfChange: EmpNotificationDetailsOfChange;
  notificationFiles: AttachedFile[];
  isEditable: boolean;
  isSubtaskCompleted: boolean;
  wizardMap: SubTaskListMap<EmissionsMonitoringPlanNotification>;
  wizardStep: { [key: string]: string };
}
