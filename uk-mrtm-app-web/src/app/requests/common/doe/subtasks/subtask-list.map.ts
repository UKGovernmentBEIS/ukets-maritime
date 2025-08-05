import { DoeMaritimeEmissions, DoeTotalMaritimeEmissions } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const maritimeEmissionsMap: SubTaskListMap<DoeMaritimeEmissions> = {
  title: 'Maritime emissions',
  determinationReason: { title: 'Reason for determining maritime emissions or emissions figure for surrender' },
  totalMaritimeEmissions: { title: 'Determination of maritime emissions or emissions figure for surrender' },
  chargeOperator: { title: 'Do you need to charge the operator a fee?' },
  feeDetails: { title: 'Calculate the operator’s fee' },
};

export const doeTotalMaritimeEmissionsMap: SubTaskListMap<DoeTotalMaritimeEmissions> = {
  title: 'Emissions calculations',
  determinationType: {
    title: 'Select whether you are determining maritime emissions or only the emissions figure for surrender',
  },
  totalReportableEmissions: { title: 'Total maritime emissions' },
  smallIslandFerryDeduction: { title: 'Less small island ferry deduction' },
  iceClassDeduction: { title: 'Less 5% ice class deduction' },
  surrenderEmissions: { title: 'Emissions figure for surrender' },
  calculationApproach: { title: 'How have you calculated the emissions?' },
  supportingDocuments: { title: 'Supporting documents' },
};
