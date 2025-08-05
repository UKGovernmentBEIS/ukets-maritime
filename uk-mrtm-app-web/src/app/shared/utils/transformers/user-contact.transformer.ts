export const userContactTransformer = (contact: string): string => {
  switch (contact) {
    case 'PRIMARY':
      return 'Primary contact';
    case 'SECONDARY':
      return 'Secondary contact';
    case 'SERVICE':
      return 'Service contact';
    case 'FINANCIAL':
      return 'Financial contact';
    case 'CA_SITE':
    case 'VB_SITE':
      return 'Site contact';
    default:
      return '';
  }
};
