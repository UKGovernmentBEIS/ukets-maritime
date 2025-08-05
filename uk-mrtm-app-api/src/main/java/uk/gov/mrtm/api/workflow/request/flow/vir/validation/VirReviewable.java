package uk.gov.mrtm.api.workflow.request.flow.vir.validation;

import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;

import java.util.Map;

public interface VirReviewable {

    RegulatorReviewResponse getRegulatorReviewResponse();

    Map<String, OperatorImprovementResponse> getOperatorImprovementResponses();
}
