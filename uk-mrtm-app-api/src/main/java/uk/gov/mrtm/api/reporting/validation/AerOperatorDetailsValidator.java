package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerOperatorDetails;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AerOperatorDetailsValidator implements AerContextValidator {

    private final MrtmAccountQueryService accountQueryService;

    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        List<AerViolation> empViolations = new ArrayList<>();
        final String imoNumber = aerContainer.getAer().getOperatorDetails().getImoNumber();
        if (!accountQueryService.existsByImoNumberAndId(imoNumber, accountId)) {
            empViolations.add(new AerViolation(AerOperatorDetails.class.getSimpleName(),
                AerViolation.ViolationMessage.INVALID_IMO_NUMBER, imoNumber));
        }
        return AerValidationResult.builder()
            .valid(empViolations.isEmpty())
            .aerViolations(empViolations)
            .build();
    }
}
