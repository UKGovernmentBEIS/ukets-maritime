package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.reporting.validation.AerValidatorHelper.getUniqueFuelName;

@Service
@RequiredArgsConstructor
public class AerSmfValidator implements AerContextValidator {

    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        return validate(
            aerContainer.getAer().getSmf(),
            aerContainer.getAer().getEmissions());
    }

    public AerValidationResult validate(AerSmf smf, AerEmissions emissions) {
        List<AerViolation> aerViolations = new ArrayList<>();

        if (Boolean.TRUE.equals(smf.getExist())) {

            final Set<String> smfFuels = smf.getSmfDetails().getPurchases().stream()
                .map(AerSmfPurchase::getFuelOriginTypeName)
                .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                .collect(Collectors.toSet());

            final Set<String> allFuels = emissions.getShips()
                .stream()
                .flatMap(shipEmissions -> shipEmissions.getFuelsAndEmissionsFactors().stream())
                .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                .collect(Collectors.toSet());

            smfFuels.removeAll(allFuels);
            if (!smfFuels.isEmpty()) {
                aerViolations.add(new AerViolation(AerSmf.class.getSimpleName(),
                    AerViolation.ViolationMessage.INVALID_FUEL_CONSUMPTION,
                    smfFuels.toArray()));
            }
        }

        return AerValidationResult.builder()
            .valid(aerViolations.isEmpty())
            .aerViolations(aerViolations)
            .build();
    }
}