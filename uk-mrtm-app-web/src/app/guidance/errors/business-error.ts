import { BusinessError } from '@netz/common/error';

export const guidanceSectionNameExist = (): BusinessError =>
  new BusinessError('Guidance section name already exists').withLink({
    link: ['/guidance'],
    linkText: 'Return to: Guidance',
  });
