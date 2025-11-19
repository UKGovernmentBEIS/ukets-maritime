package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortDetails;
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
public class AerPortEmissionsValidator implements AerContextValidator {

    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        List<AerViolation> aerViolations = new ArrayList<>();

        for (AerPort port : aerContainer.getAer().getPortEmissions().getPorts()) {
            AerShipEmissions ship = aerContainer.getAer().getEmissions().getShips()
                .stream()
                .filter(aerShipEmissions -> aerShipEmissions.getDetails().getImoNumber().equals(port.getImoNumber()))
                .findFirst()
                .orElse(null);

            AerValidatorHelper.validateShipExistsInListOfShips(ship, port.getImoNumber(), aerViolations, AerPort.class);

            AerValidatorHelper.validateDirectEmissionsOrFuelConsumptionsExist(
                port.getFuelConsumptions(),
                port.getDirectEmissions(),
                aerViolations,
                AerPort.class
            );

            AerValidatorHelper.validateEmissionsInputIsPositiveOrZero(
                port.getDirectEmissions(),
                aerViolations,
                AerPort.class
            );

            AerPortDetails portDetails = port.getPortDetails();
            AerValidatorHelper.validateVisit(portDetails.getVisit(), aerViolations, AerPort.class);
            AerValidatorHelper.validateArrivalAndDepartureYear(
                portDetails.getArrivalTime().getYear(),
                portDetails.getDepartureTime().getYear(),
                aerContainer.getReportingYear().getValue(), aerViolations, AerPort.class);

            if (ship != null) {
                AerValidatorHelper.validateCcsAndCcu(portDetails.getCcu(), portDetails.getCcs(),
                    ship.getDerogations().getCarbonCaptureAndStorageReduction(), aerViolations, AerPort.class);

                AerValidatorHelper.validateSmallIslandFerryReduction(portDetails.getSmallIslandFerryReduction(),
                    ship.getDerogations().getSmallIslandFerryOperatorReduction(), aerViolations, AerPort.class);

                AerValidatorHelper.validateFuelConsumptions(ship, port.getFuelConsumptions(), aerViolations, AerPort.class);
            }
        }

        hasOverlappingVisits(aerContainer.getAer().getPortEmissions().getPorts(), aerViolations);

        return AerValidationResult.builder()
        .valid(aerViolations.isEmpty())
        .aerViolations(aerViolations)
        .build();
    }

    private void hasOverlappingVisits(Set<AerPort> ports, List<AerViolation> aerViolations) {

        // IMO number -> [<arrival time, departure time>, ...]
        Map<String, List<Pair<LocalDateTime, LocalDateTime>>> voyagesByShip = new HashMap<>();
        for (AerPort port : ports) {
            List<Pair<LocalDateTime, LocalDateTime>> voyage = voyagesByShip.getOrDefault(port.getImoNumber(), new ArrayList<>());
            voyage.add(Pair.of(port.getPortDetails().getArrivalTime(), port.getPortDetails().getDepartureTime()));
            voyagesByShip.put(port.getImoNumber(), voyage);
        }

        validatePortVisitsDoNotOverlap(voyagesByShip, aerViolations);
    }

    private void validatePortVisitsDoNotOverlap(Map<String, List<Pair<LocalDateTime, LocalDateTime>>> visitsByShip,
                                                         List<AerViolation> aerViolations) {

        for (Map.Entry<String, List<Pair<LocalDateTime, LocalDateTime>>> entry : visitsByShip.entrySet()) {
            List<Pair<LocalDateTime, LocalDateTime>> voyage = entry.getValue();

            // Sort port visits by arrival time
            voyage.sort(Comparator.comparing(Pair::getLeft));

            // Check for overlaps
            for (int i = 1; i < voyage.size(); i++) {
                LocalDateTime previousVisitDepartureTime = voyage.get(i - 1).getRight();
                LocalDateTime currentVisitArrivalTime = voyage.get(i).getLeft();

                if (!currentVisitArrivalTime.isAfter(previousVisitDepartureTime)) {
                    aerViolations.add(new AerViolation(AerPort.class.getSimpleName(),
                        AerViolation.ViolationMessage.OVERLAPPING_VISIT_FOUND,
                        entry.getKey(), previousVisitDepartureTime, currentVisitArrivalTime));
                }
            }
        }
    }
}
