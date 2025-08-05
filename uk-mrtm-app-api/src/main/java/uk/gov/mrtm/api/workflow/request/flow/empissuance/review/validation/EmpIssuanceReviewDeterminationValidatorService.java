package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.List;

@Validated
@Service
@RequiredArgsConstructor
public class EmpIssuanceReviewDeterminationValidatorService {

    private final List<EmpIssuanceReviewDeterminationTypeValidator> validators;


    public boolean isValid(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload,
                           EmpIssuanceDeterminationType determinationType) {

        EmpIssuanceReviewDeterminationTypeValidator validator = validators.stream()
                .filter(v -> determinationType.equals(v.getType()))
                .findFirst()
                .orElseThrow(() -> {
                    throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
                });

        return validator.isValid(requestTaskPayload);
    }

    public void validateDeterminationObject(@NotNull @Valid EmpIssuanceDetermination determination) {
        // validate determination upon EMP submit
    }

}
