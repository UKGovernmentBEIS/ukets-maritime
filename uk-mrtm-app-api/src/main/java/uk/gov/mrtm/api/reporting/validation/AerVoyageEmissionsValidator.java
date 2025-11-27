package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageDetails;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AerVoyageEmissionsValidator implements AerContextValidator {


    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        List<AerViolation> aerViolations = new ArrayList<>();

        for (AerVoyage voyage : aerContainer.getAer().getVoyageEmissions().getVoyages()) {
            AerShipEmissions ship = aerContainer.getAer().getEmissions().getShips()
                .stream()
                .filter(aerShipEmissions -> aerShipEmissions.getDetails().getImoNumber().equals(voyage.getImoNumber()))
                .findFirst()
                .orElse(null);

            AerValidatorHelper.validateShipExistsInListOfShips(ship, voyage.getImoNumber(), aerViolations, AerVoyage.class);

            AerValidatorHelper.validateDirectEmissionsOrFuelConsumptionsExist(
                voyage.getFuelConsumptions(),
                voyage.getDirectEmissions(),
                aerViolations,
                AerVoyage.class
            );

            AerValidatorHelper.validateEmissionsInputIsPositiveOrZero(
                voyage.getDirectEmissions(),
                aerViolations,
                AerVoyage.class
            );

            AerVoyageDetails portDetails = voyage.getVoyageDetails();
            AerValidatorHelper.validateVisit(portDetails.getArrivalPort(), aerViolations, AerVoyage.class);
            AerValidatorHelper.validateVisit(portDetails.getDeparturePort(), aerViolations, AerVoyage.class);
            AerValidatorHelper.validateArrivalAndDepartureYear(
                portDetails.getArrivalTime().getYear(),
                portDetails.getDepartureTime().getYear(),
                aerContainer.getReportingYear().getValue(), aerViolations, AerVoyage.class);

            if (ship != null) {
                AerValidatorHelper.validateFuelConsumptions(ship, voyage.getFuelConsumptions(), aerViolations, AerVoyage.class);
            }
        }

        hasOverlappingJourneys(aerContainer.getAer().getVoyageEmissions().getVoyages(), aerViolations);

        return AerValidationResult.builder()
        .valid(aerViolations.isEmpty())
        .aerViolations(aerViolations)
        .build();
    }

    private void hasOverlappingJourneys(Set<AerVoyage> voyages, List<AerViolation> aerViolations) {

        // IMO number -> [<arrival time, departure time>, ...]
        Map<String, List<Pair<LocalDateTime, LocalDateTime>>> voyagesByShip = new HashMap<>();
        for (AerVoyage voyage : voyages) {
            List<Pair<LocalDateTime, LocalDateTime>> journey = voyagesByShip.getOrDefault(voyage.getImoNumber(), new ArrayList<>());
            journey.add(Pair.of(voyage.getVoyageDetails().getDepartureTime(), voyage.getVoyageDetails().getArrivalTime()));
            voyagesByShip.put(voyage.getImoNumber(), journey);
        }

        validateVoyagesDoNotOverlap(voyagesByShip, aerViolations);
    }

    private void validateVoyagesDoNotOverlap(Map<String, List<Pair<LocalDateTime, LocalDateTime>>> voyagesByShip,
                                                      List<AerViolation> aerViolations) {

        for (Map.Entry<String, List<Pair<LocalDateTime, LocalDateTime>>> entry : voyagesByShip.entrySet()) {
            List<Pair<LocalDateTime, LocalDateTime>> voyage = entry.getValue();

            // Sort voyages by departure time
            voyage.sort(Comparator.comparing(Pair::getLeft));

            // Check for overlaps
            for (int i = 1; i < voyage.size(); i++) {
                LocalDateTime previousVoyageArrivalTime = voyage.get(i - 1).getRight();
                LocalDateTime currentVoyageDepartureTime = voyage.get(i).getLeft();

                if (!currentVoyageDepartureTime.isAfter(previousVoyageArrivalTime)) {
                    aerViolations.add(new AerViolation(AerVoyage.class.getSimpleName(),
                        AerViolation.ViolationMessage.OVERLAPPING_VOYAGES_FOUND,
                        entry.getKey(), previousVoyageArrivalTime, currentVoyageDepartureTime));
                }
            }
        }
    }
}
