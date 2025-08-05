import { SubTaskListMap } from '@shared/types';

export const nonComplianceDetailsMap: SubTaskListMap<{
  details: string;
  nonComplianceDate: string;
  complianceDate: string;
  selectedRequests: string;
  civilPenalty: string;
  noticeOfIntent: string;
  initialPenalty: string;
}> = {
  title: 'Provide details of the non-compliance',
  caption: 'Details of non-compliance',
  details: { title: 'Enter details of non-compliance' },
  nonComplianceDate: { title: 'When did the operator become non-compliant?' },
  complianceDate: { title: 'When did the operator become compliant?' },
  selectedRequests: { title: 'Choose task or workflow (optional)' },
  civilPenalty: { title: 'Have we decided to proceed with enforcement?' },
  noticeOfIntent: { title: 'Do you want to proceed with a notice of intent?' },
  initialPenalty: { title: 'Do you want to issue an initial penalty notice?' },
};
