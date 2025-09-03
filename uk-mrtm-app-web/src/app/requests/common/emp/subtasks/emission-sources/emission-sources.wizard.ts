import { EmpEmissionCompliance, EmpEmissionFactors, EmpEmissionSources, EmpProcedureForm } from '@mrtm/api';

import { empProcedureFormCompleted } from '@requests/common/emp/subtasks/subtasks.helpers';

const emissionSourcesCheckMap: Record<
  keyof EmpEmissionSources,
  (arg: EmpProcedureForm | EmpEmissionCompliance | EmpEmissionFactors) => boolean
> = {
  listCompletion: empProcedureFormCompleted,
  emissionFactors: (factors: EmpEmissionFactors) =>
    factors.exist === true || (factors.exist === false && empProcedureFormCompleted(factors.factors)),
  emissionCompliance: (compliance: EmpEmissionCompliance) =>
    compliance.exist === false || (compliance.exist === true && empProcedureFormCompleted(compliance.criteria)),
};

export const isEmissionSourcesCompleted = (emissionSources: EmpEmissionSources) => {
  const validationResults = Object.keys(emissionSources ?? {}).map(
    (key) => emissionSourcesCheckMap[key](emissionSources[key]) as boolean,
  );

  return (
    validationResults.length === Object.keys(emissionSourcesCheckMap).length && validationResults.every((x) => !!x)
  );
};
