package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import jakarta.validation.Valid;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;

public interface EmpContextValidator {

    EmissionsMonitoringPlanValidationResult validate(@Valid EmissionsMonitoringPlanContainer empContainer, Long accountId);

}
