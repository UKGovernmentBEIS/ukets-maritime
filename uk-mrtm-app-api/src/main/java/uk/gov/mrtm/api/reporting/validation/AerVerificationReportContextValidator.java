package uk.gov.mrtm.api.reporting.validation;

import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;

public interface AerVerificationReportContextValidator {

    AerValidationResult validate(Aer aer, AerVerificationReport verificationReport);

}
