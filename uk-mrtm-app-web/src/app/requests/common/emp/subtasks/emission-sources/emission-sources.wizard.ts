import { EmpEmissionCompliance, EmpEmissionFactors, EmpEmissionSources, EmpProcedureForm } from '@mrtm/api';

import { empProcedureFormCompleted } from '@requests/common/emp/subtasks/subtasks.helpers';

const emissionSourcesCheckMap: Record<
  keyof Omit<EmpEmissionSources, 'emissionCompliance'>,
  (arg: EmpProcedureForm | EmpEmissionCompliance | EmpEmissionFactors) => boolean
> = {
  listCompletion: empProcedureFormCompleted,
  emissionFactors: (factors: EmpEmissionFactors) =>
    factors.exist === true || (factors.exist === false && empProcedureFormCompleted(factors.factors)),
};

export const isEmissionSourcesCompleted = (emissionSources: EmpEmissionSources) => {
  const validationResults = new Array<boolean>();
  for (const key of Object.keys(emissionSources ?? {})) {
    const validationFn = emissionSourcesCheckMap[key];

    if (!validationFn) {
      continue;
    }

    validationResults.push(validationFn(emissionSources[key]));
  }

  return (
    validationResults.length === Object.keys(emissionSourcesCheckMap).length && validationResults.every((x) => !!x)
  );
};
