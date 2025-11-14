import { SubTaskListMap } from '@shared/types';

export const reductionClaimMap: SubTaskListMap<{
  exist: string;
  smfDetails: string;
  purchaseAdd: string;
  purchaseEdit: string;
}> = {
  title: 'Reduction claim',
  exist: {
    title: 'Emissions reduction claim',
    caption: 'Reduction claim',
    description:
      'To make an emissions reduction claim through the annual emissions reporting process, you must calculate the mass of eligible fuel as defined in the regulations.',
  },
  smfDetails: {
    caption: 'Reduction claim',
    title: 'Eligible fuel purchase list',
  },
  purchaseAdd: {
    caption: 'Reduction claim',
    title: 'Add an eligible fuel purchase',
    description: 'Provide information for each batch of eligible fuel included in your claim.',
  },
  purchaseEdit: {
    caption: 'Reduction claim',
    title: 'Edit an eligible fuel purchase',
    description: 'Provide information for each batch of eligible fuel included in your claim.',
  },
};
