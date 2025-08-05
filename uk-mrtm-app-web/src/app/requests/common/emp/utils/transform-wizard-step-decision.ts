export const transformWizardStepDecision = (wizardStep: { [s: string]: string }) => {
  const transformedEnum = {};

  Object.keys(wizardStep).forEach((key) => {
    const value = wizardStep[key];
    transformedEnum[key] = value.startsWith('../') ? value : `../${value}`;
  });

  return transformedEnum as { [s: string]: string };
};
