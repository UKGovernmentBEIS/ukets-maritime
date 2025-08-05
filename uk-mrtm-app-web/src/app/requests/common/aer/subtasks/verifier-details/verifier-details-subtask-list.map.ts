import { SubTaskListMap } from '@shared/types';

export const verifierDetailsMap: SubTaskListMap<{
  verifierContact: string;
  verificationTeamDetails: string;
  name: string;
  email: string;
  phoneNumber: string;
  leadEtsAuditor: string;
  etsAuditors: string;
  etsTechnicalExperts: string;
  independentReviewer: string;
  technicalExperts: string;
  authorisedSignatoryName: string;
}> = {
  title: 'Verifier details',
  caption: 'Complete the verification details',
  verifierContact: { title: 'Verifier contact' },
  verificationTeamDetails: { title: 'Verification team details' },
  name: { title: 'Name' },
  email: { title: 'Email' },
  phoneNumber: { title: 'Telephone number' },
  leadEtsAuditor: { title: 'Lead ETS auditor' },
  etsAuditors: { title: 'ETS auditors' },
  etsTechnicalExperts: { title: 'Technical experts (ETS auditor)' },
  independentReviewer: { title: 'Independent reviewer' },
  technicalExperts: { title: 'Technical experts (Independent Review)' },
  authorisedSignatoryName: { title: 'Name of authorised signatory' },
};
