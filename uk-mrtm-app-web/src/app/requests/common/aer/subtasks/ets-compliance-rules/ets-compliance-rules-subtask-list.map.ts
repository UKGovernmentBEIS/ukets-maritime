import { SubTaskListMap } from '@shared/types';

export const etsComplianceRulesMap: SubTaskListMap<{
  monitoringPlanRequirementsMet: string;
  etsOrderRequirementsMet: string;
  detailSourceDataVerified: string;
  controlActivitiesDocumented: string;
  proceduresMonitoringPlanDocumented: string;
  dataVerificationCompleted: string;
  monitoringApproachAppliedCorrectly: string;
  methodsApplyingMissingDataUsed: string;
  competentAuthorityGuidanceMet: string;
  nonConformities: string;
}> = {
  title: 'Compliance with the UKETS Order',
  caption: 'Compliance with ETS rules',
  monitoringPlanRequirementsMet: {
    title: 'Have the emissions monitoring plan requirements and conditions been met?',
  },
  etsOrderRequirementsMet: {
    title: 'Have the requirements of the UK ETS Order been met?',
  },
  detailSourceDataVerified: {
    title: 'Can you verify the detail and source of data?',
  },
  controlActivitiesDocumented: {
    title: 'Were control activities documented, implemented, maintained and effective to reduce any risks?',
  },
  proceduresMonitoringPlanDocumented: {
    title:
      'Were procedures in the emissions monitoring plan documented, implemented, maintained and effective to reduce any risks?',
  },
  dataVerificationCompleted: {
    title: 'Has data verification been completed as required?',
  },
  monitoringApproachAppliedCorrectly: {
    title: 'Have the monitoring approaches been applied correctly?',
  },
  methodsApplyingMissingDataUsed: {
    title: 'Were methods used for applying missing data appropriate?',
  },
  competentAuthorityGuidanceMet: {
    title: 'Has any relevant regulator guidance on monitoring and reporting been met?',
  },
  nonConformities: {
    title: 'Have any non-conformities from last year been corrected?',
  },
};
