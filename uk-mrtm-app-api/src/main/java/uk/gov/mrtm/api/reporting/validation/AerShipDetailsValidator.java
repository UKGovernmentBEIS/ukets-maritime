package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AerShipDetailsValidator implements AerContextValidator {

    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        return validate(aerContainer.getAer().getEmissions(), aerContainer.getReportingYear());
    }

    public AerValidationResult validate(AerEmissions emissions, Year reportingYear) {
        List<AerViolation> aerViolations = new ArrayList<>();

        for (AerShipEmissions ship : emissions.getShips()) {
            LocalDate from = ship.getDetails().getFrom();
            LocalDate to = ship.getDetails().getTo();

            boolean invalidFromYear = from != null && from.getYear() != reportingYear.getValue();
            boolean invalidToYear = to != null && to.getYear() != reportingYear.getValue();
            if (invalidFromYear || invalidToYear) {
                aerViolations.add(new AerViolation(AerShipDetails.class.getSimpleName(),
                    AerViolation.ViolationMessage.SHIP_DETAILS_INVALID_YEAR, ship.getDetails().getImoNumber()));
            }
        }

        return AerValidationResult.builder()
            .valid(aerViolations.isEmpty())
            .aerViolations(aerViolations)
            .build();
    }
}