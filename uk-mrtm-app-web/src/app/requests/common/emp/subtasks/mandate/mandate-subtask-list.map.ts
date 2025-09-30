import { EmpMandate } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const mandateSubtaskMap: SubTaskListMap<
  EmpMandate & {
    registeredOwnersAddForm: boolean;
    registeredOwnersEditForm: boolean;
    decision: string;
    uploadOwners: string;
  }
> = {
  caption: 'Delegated UK ETS responsibility',
  title: 'Delegated responsibility',
  exist: {
    title:
      'Has the responsibility for compliance with UK ETS been delegated to you by one or more registered owners for one or more ships?',
    description: 'Are you sure that you do not have responsibility for the added ships?',
  },
  registeredOwners: {
    title: 'Registered owners',
  },
  registeredOwnersAddForm: {
    caption: 'Add registered owner',
    title: 'Add registered owner details and associated ships',
  },
  registeredOwnersEditForm: {
    caption: 'Edit registered owner',
    title: 'Edit registered owner details and associated ships',
  },
  responsibilityDeclaration: {
    title: 'Declaration of delegation of UK ETS responsibility',
  },
  decision: {
    title: 'Review delegated responsibility',
  },
  uploadOwners: {
    title: 'Upload the registered owner file',
  },
};
