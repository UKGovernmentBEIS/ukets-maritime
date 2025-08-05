package uk.gov.mrtm.api.workflow.request.flow.vir.validation;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Validated
@RequiredArgsConstructor
public class VirSubmitValidator {

    public void validate(
        final @NotEmpty Map<String, @Valid @NotNull OperatorImprovementResponse> operatorImprovementResponseMap,
        final VirVerificationData verificationData
    ) {

        final Set<String> references = Stream.of(
            verificationData.getUncorrectedNonConformities().keySet(),
            verificationData.getPriorYearIssues().keySet(),
            verificationData.getRecommendedImprovements().keySet()
        ).flatMap(Set::stream).collect(Collectors.toSet());

        final Collection<String> difference =
            CollectionUtils.disjunction(references, operatorImprovementResponseMap.keySet());

        if (!difference.isEmpty()) {
            throw new BusinessException(MrtmErrorCode.INVALID_VIR, difference.toArray());
        }
    }
}
