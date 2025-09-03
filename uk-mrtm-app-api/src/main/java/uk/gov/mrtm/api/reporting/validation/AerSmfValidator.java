package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AerSmfValidator implements AerContextValidator {

    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        List<AerViolation> aerViolations = new ArrayList<>();

        AerSmf smf = aerContainer.getAer().getSmf();

        if (Boolean.TRUE.equals(smf.getExist())) {

            final Set<FuelOriginTypeName> allFuels = aerContainer.getAer().getEmissions().getShips()
                .stream()
                .flatMap(shipEmissions -> shipEmissions.getFuelsAndEmissionsFactors().stream())
                .map(AerValidatorHelper::buildFuelOriginTypeName)
                .collect(Collectors.toSet());

            final Set<FuelOriginTypeName> smfFuels = smf.getSmfDetails().getPurchases().stream()
                .map(AerSmfPurchase::getFuelOriginTypeName)
                .map(AerValidatorHelper::buildFuelOriginTypeName)
                .collect(Collectors.toSet());

            boolean allFuelsIncluded = allFuels.containsAll(smfFuels);
            if (!allFuelsIncluded) {
                aerViolations.add(new AerViolation(AerSmf.class.getSimpleName(),
                    AerViolation.ViolationMessage.INVALID_FUEL_CONSUMPTION));
            }
        }

        return AerValidationResult.builder()
                .valid(aerViolations.isEmpty())
                .aerViolations(aerViolations)
                .build();
    }
}