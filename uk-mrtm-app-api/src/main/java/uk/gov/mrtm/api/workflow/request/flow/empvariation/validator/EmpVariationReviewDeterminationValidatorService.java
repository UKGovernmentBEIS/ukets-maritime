package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.List;

@Validated
@Service
@RequiredArgsConstructor
public class EmpVariationReviewDeterminationValidatorService {

    private final List<EmpVariationReviewDeterminationTypeValidator> validators;


    public boolean isValid(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload,
                           EmpVariationDeterminationType determinationType) {

        EmpVariationReviewDeterminationTypeValidator validator = validators.stream()
                .filter(v -> determinationType.equals(v.getType()))
                .findFirst()
                .orElseThrow(() -> {
                    throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
                });

        return validator.isValid(requestTaskPayload);
    }

    public void validateDeterminationObject(@NotNull @Valid EmpVariationDetermination determination) {
        //validate determination
    }
}
