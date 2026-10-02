import { EmpEmissionFactors, EmpEmissionSources } from '@mrtm/api';

import { EuXmlMonitoringPlan } from '@requests/common/eu-xml-import/eu-xml-import.types';
import { mapProcedureForm } from '@requests/common/eu-xml-import/mappers/procedure-form.mapper';
import { XmlValidationError } from '@shared/types';

export function mapEmissionSources(plan: EuXmlMonitoringPlan): {
  emissionSources: Partial<EmpEmissionSources>;
  procedureWarnings: XmlValidationError[];
} {
  const warnings: XmlValidationError[] = [];
  const b5 = plan.emissionSources?.procedureAnnexITableB5;

  const listCompletion = mapProcedureForm(b5, 'Emission sources (list completion procedure)', warnings);
  // B8 (default values used) and B9 (biofuels information) do not map cleanly onto the combined
  // Determination of Emissions Factors guard question, so those nodes are ignored and the
  // question is left unanswered for the operator to complete explicitly.
  const emissionFactors: EmpEmissionFactors = { exist: undefined };

  return { emissionSources: { listCompletion, emissionFactors }, procedureWarnings: warnings };
}
