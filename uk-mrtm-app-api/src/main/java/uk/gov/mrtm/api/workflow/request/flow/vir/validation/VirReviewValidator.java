package uk.gov.mrtm.api.workflow.request.flow.vir.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

@Validated
@Service
public class VirReviewValidator {

    public void validate(final @Valid @NotNull RegulatorReviewResponse regulatorReviewResponse,
                         final Map<String, OperatorImprovementResponse> operatorImprovementResponses) {
        Set<String> references = operatorImprovementResponses.keySet();
        Set<String> regulatorReferences = regulatorReviewResponse.getRegulatorImprovementResponses().keySet();

        Collection<String> difference = CollectionUtils.disjunction(references, regulatorReferences);

        if(!difference.isEmpty()) {
            throw new BusinessException(MrtmErrorCode.INVALID_VIR_REVIEW, difference.toArray());
        }
    }
}
