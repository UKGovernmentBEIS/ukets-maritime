import { RequestTaskPageContentFactory } from '@netz/common/request-task';

import { EmpVariationRegulatorApprovedComponent } from '@requests/timeline/emp-variation-regulator-approved/emp-variation-regulator-approved.component';

export const empVariationRegulatorApprovedTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: 'Approved',
    component: EmpVariationRegulatorApprovedComponent,
    sections: [],
  };
};
