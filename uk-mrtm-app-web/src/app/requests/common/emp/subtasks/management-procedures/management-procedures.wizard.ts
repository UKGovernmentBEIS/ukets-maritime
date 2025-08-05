import { EmpManagementProcedures } from '@mrtm/api';

export const isManagementProceduresCompleted = (managementProcedures: EmpManagementProcedures) => {
  return (
    managementProcedures?.monitoringReportingRoles?.every((mrr) => mrr.jobTitle && mrr.mainDuties) &&
    !!managementProcedures.regularCheckOfAdequacy?.description &&
    !!managementProcedures.regularCheckOfAdequacy.recordsLocation &&
    !!managementProcedures.regularCheckOfAdequacy.responsiblePersonOrPosition &&
    !!managementProcedures.dataFlowActivities?.description &&
    !!managementProcedures.dataFlowActivities.recordsLocation &&
    !!managementProcedures.dataFlowActivities.responsiblePersonOrPosition &&
    !!managementProcedures.riskAssessmentProcedures?.description &&
    !!managementProcedures.riskAssessmentProcedures.recordsLocation &&
    !!managementProcedures.riskAssessmentProcedures.responsiblePersonOrPosition
  );
};
