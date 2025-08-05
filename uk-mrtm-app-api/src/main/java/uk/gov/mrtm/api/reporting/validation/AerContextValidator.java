package uk.gov.mrtm.api.reporting.validation;

import jakarta.validation.Valid;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;

public interface AerContextValidator {

    AerValidationResult validate(@Valid AerContainer aerContainer, Long accountId);
}
