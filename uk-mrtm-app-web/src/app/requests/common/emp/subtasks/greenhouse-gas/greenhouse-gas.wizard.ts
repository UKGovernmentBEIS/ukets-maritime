import { EmpMonitoringGreenhouseGas, EmpProcedureForm } from '@mrtm/api';

import { empProcedureFormCompleted } from '@requests/common/emp/subtasks/subtasks.helpers';

const completedCheckMap: Record<keyof EmpMonitoringGreenhouseGas, (arg: EmpProcedureForm) => boolean> = {
  fuel: empProcedureFormCompleted,
  crossChecks: empProcedureFormCompleted,
  voyages: empProcedureFormCompleted,
  qaEquipment: empProcedureFormCompleted,
  information: empProcedureFormCompleted,
};

export const isGreenhouseGasCompleted = (greenhouseGas: EmpMonitoringGreenhouseGas) => {
  const validationResults = Object.keys(greenhouseGas ?? {}).map(
    (key) => completedCheckMap[key](greenhouseGas[key]) as boolean,
  );
  return validationResults.length === Object.keys(completedCheckMap).length && validationResults.every((x) => !!x);
};
