import { AerEmissionsReductionClaimVerification } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const emissionsReductionClaimVerificationSubtaskListMap: SubTaskListMap<AerEmissionsReductionClaimVerification> =
  {
    title: 'Verify the emission reduction claim',
    caption: 'Compliance of emissions reduction claim',
    smfBatchClaimsReviewed: {
      title: "Have you reviewed the maritime operator's eligible fuel batch claims?",
    },
    batchReferencesNotReviewed: { title: 'List the batch references that were not reviewed' },
    dataSampling: { title: 'Describe how data sampling was carried out and what documents you reviewed' },
    reviewResults: {
      title: 'Describe the results of your review',
      caption: 'You can report any misstatements in the verifier findings section',
    },
    noDoubleCountingConfirmation: {
      title: 'Confirmation of no double-counting',
      description:
        'Describe the steps you took to confirm none of the eligible fuel included in the emissions reduction claim relating to the scheme year had been sold or used elsewhere by the maritime operator to claim an emission reduction, or financial benefit, in any other mandatory or voluntary scheme',
    },
    evidenceAllCriteriaMetExist: {
      title: 'Do all of the batch claims reviewed contain evidence that shows the eligibility criteria were met?',
      description: 'Valid batch claims must meets the criteria of an eligible fuel',
    },
    noCriteriaMetIssues: { title: 'What issues have you identified?' },
    complianceWithEmpRequirementsExist: {
      title:
        'Was the maritime operator’s emissions reduction claim compliant with their emissions monitoring plan, the legislation and regulator guidance?',
      description: 'This includes the requirements to ensure there has been no double-counting',
    },
    notCompliedWithEmpRequirementsAspects: { title: 'What aspects were not complied with?' },
  };
