export const userRoleTransformer = (role: string): string => {
  switch (role) {
    case 'operator_admin':
      return 'Operator admin';
    case 'operator':
      return 'Operator';
    case 'consultant_agent':
      return 'Consultant';
    case 'emitter_contact':
      return 'Emitter Contact';
  }
};
