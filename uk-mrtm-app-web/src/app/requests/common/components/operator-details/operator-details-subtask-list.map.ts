import { SubTaskListMap } from '@shared/types';

export const operatorDetailsMap: SubTaskListMap<{
  operatorDetails: string;
  undertakenActivities: string;
  declarationDocuments: string;
  legalStatusOfOrganisation: string;
  organisationDetails: string;
  variationRegulatorDecision: string;
  decision: string;
}> = {
  title: 'Operator details',
  operatorDetails: {
    title: 'Check Maritime Operator details',
  },
  undertakenActivities: {
    title: 'Describe the activities carried out by the Maritime Operator',
  },
  declarationDocuments: {
    title: 'Do you want to provide documents relating to Mandates or Declarations?',
  },
  legalStatusOfOrganisation: {
    title: 'What is the legal status of your organisation?',
  },
  organisationDetails: {
    title: 'Check Maritime Operator details',
  },
  variationRegulatorDecision: {
    title: 'Update operator details',
  },
  decision: {
    title: 'Review operator details',
  },
};
