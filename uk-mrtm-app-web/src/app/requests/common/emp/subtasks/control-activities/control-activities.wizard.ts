import { EmpControlActivities, EmpOutsourcedActivities, EmpProcedureForm } from '@mrtm/api';

import { empProcedureFormCompleted } from '@requests/common/emp/subtasks/subtasks.helpers';

const isOutsourcedActivitiesCompleted = (outsource: EmpOutsourcedActivities) =>
  outsource?.exist === false || (outsource?.exist === true && empProcedureFormCompleted(outsource?.details));

const completedCheckMap: Record<
  keyof EmpControlActivities,
  (arg: EmpProcedureForm | EmpOutsourcedActivities) => boolean
> = {
  documentation: empProcedureFormCompleted,
  outsourcedActivities: isOutsourcedActivitiesCompleted,
  qualityAssurance: empProcedureFormCompleted,
  corrections: empProcedureFormCompleted,
  internalReviews: empProcedureFormCompleted,
};

export const isControlActivitiesCompleted = (controlActivities: EmpControlActivities) => {
  const validationResults = Object.keys(controlActivities ?? {}).map(
    (key) => completedCheckMap[key](controlActivities[key]) as boolean,
  );
  return validationResults.length === Object.keys(completedCheckMap).length && validationResults.every((x) => !!x);
};
