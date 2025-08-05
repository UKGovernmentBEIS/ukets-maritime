import { buildSaveNotFoundError, buildSavePartiallyNotFoundError, BusinessError } from './business-error';

export const taskNotFoundError = buildSaveNotFoundError().withLink({
  link: ['/dashboard'],
  linkText: 'Return to: Dashboard',
});

export const taskSubmitNotFoundError = buildSavePartiallyNotFoundError().withLink({
  link: ['/dashboard'],
  linkText: 'Return to: Dashboard',
});

export const requestTaskReassignedError = () =>
  new BusinessError('These changes cannot be saved because the task has been reassigned').withLink({
    link: ['/dashboard'],
    linkText: 'Return to: Dashboard',
  });
