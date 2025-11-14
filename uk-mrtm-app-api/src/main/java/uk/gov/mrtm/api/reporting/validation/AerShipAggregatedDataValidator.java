package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AerShipAggregatedDataValidator implements AerContextValidator {


    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        List<AerViolation> aerViolations = new ArrayList<>();

        Set<String> portShips = aerContainer.getAer().getPortEmissions().getPorts().stream()
                .map(AerPort::getImoNumber)
                .collect(Collectors.toSet());

        Set<String> voyageShips = aerContainer.getAer().getVoyageEmissions().getVoyages().stream()
                .map(AerVoyage::getImoNumber)
                .collect(Collectors.toSet());

        for (AerShipAggregatedData aggregatedData : aerContainer.getAer().getAggregatedData().getEmissions()) {
            validateAggregatedData(aerContainer, aggregatedData, portShips, voyageShips, aerViolations);
        }

        return AerValidationResult.builder()
                .valid(aerViolations.isEmpty())
                .aerViolations(aerViolations)
                .build();
    }

    private void validateAggregatedData(AerContainer aerContainer,
                                        AerShipAggregatedData aggregatedData,
                                        Set<String> portShips,
                                        Set<String> voyageShips,
                                        List<AerViolation> aerViolations) {

        if (!aggregatedData.isFromFetch()) {
            validateInputEmissionsArePositiveOrZero(aggregatedData, aerViolations);
        }

        AerShipEmissions ship = aerContainer.getAer().getEmissions().getShips().stream()
                .filter(s -> s.getDetails().getImoNumber().equals(aggregatedData.getImoNumber()))
                .findFirst()
                .orElse(null);

        AerValidatorHelper.validateShipExistsInListOfShips(ship, aggregatedData.getImoNumber(),
                aerViolations, AerShipAggregatedData.class);

        validateFetchedShipInPortsOrVoyages(aggregatedData, portShips, voyageShips, aerViolations);

        if (ship != null) {
            validateFuelConsumptions(ship, aggregatedData, aerViolations);
        }
    }

    private void validateFetchedShipInPortsOrVoyages(AerShipAggregatedData aggregatedData,
                                                     Set<String> portShips,
                                                     Set<String> voyageShips,
                                                     List<AerViolation> aerViolations) {
        boolean fetchedShipNotIncludedInPortsOrVoyages = aggregatedData.isFromFetch()
                && !portShips.contains(aggregatedData.getImoNumber())
                && !voyageShips.contains(aggregatedData.getImoNumber());

        if (fetchedShipNotIncludedInPortsOrVoyages) {
            aerViolations.add(new AerViolation(
                    AerShipAggregatedData.class.getSimpleName(),
                    AerViolation.ViolationMessage.AGGREGATED_DATA_FETCHED_SHIP_NOT_FOUND_IN_PORTS_OR_VOYAGES,
                    aggregatedData.getImoNumber()));
        }
    }

    private void validateFuelConsumptions(AerShipEmissions ship,
                                          AerShipAggregatedData aggregatedData,
                                          List<AerViolation> aerViolations) {
        Set<FuelOriginTypeName> invalidFuelOriginTypeNames =
                getInvalidFuelConsumptions(ship.getFuelsAndEmissionsFactors(), aggregatedData.getFuelConsumptions());

        if (!invalidFuelOriginTypeNames.isEmpty()) {
            aerViolations.add(new AerViolation(
                    AerShipAggregatedData.class.getSimpleName(),
                    AerViolation.ViolationMessage.INVALID_FUEL_CONSUMPTION,
                    invalidFuelOriginTypeNames.toArray()));
        }

        if (hasDuplicateFuelConsumptions(aggregatedData.getFuelConsumptions())) {
            aerViolations.add(new AerViolation(
                    AerShipAggregatedData.class.getSimpleName(),
                    AerViolation.ViolationMessage.DUPLICATE_FUEL_ENTRIES));
        }
    }

    private Set<FuelOriginTypeName> getInvalidFuelConsumptions(Set<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactors,
                                                               Set<AerAggregatedDataFuelConsumption> fuelConsumptions) {
        Set<FuelOriginTypeName> invalidFuelOriginTypeNames = new HashSet<>();
        final Set<FuelOriginTypeName> fuelOriginTypeNames = fuelsAndEmissionsFactors
            .stream()
            .map(AerValidatorHelper::buildFuelOriginTypeName)
            .collect(Collectors.toSet());

        invalidFuelOriginTypeNames.addAll(
            fuelConsumptions.stream()
                .map(fuelConsumption -> AerValidatorHelper.buildFuelOriginTypeName(fuelConsumption.getFuelOriginTypeName()))
                .filter(empFuelOriginTypeName -> !fuelOriginTypeNames.contains(empFuelOriginTypeName))
                .collect(Collectors.toSet())
        );

        return invalidFuelOriginTypeNames;
    }

    private boolean hasDuplicateFuelConsumptions(Set<AerAggregatedDataFuelConsumption> fuelConsumptions) {
        Set<FuelOriginTypeName> fuelOriginTypeNames = fuelConsumptions.stream()
            .map(fuelConsumption -> AerValidatorHelper.buildFuelOriginTypeName(fuelConsumption.getFuelOriginTypeName()))
            .collect(Collectors.toSet());

        return fuelOriginTypeNames.size() != fuelConsumptions.size();
    }

    private void validateInputEmissionsArePositiveOrZero(AerShipAggregatedData aggregatedData, List<AerViolation> aerViolations) {
        AerValidatorHelper.validateEmissionsInputIsPositiveOrZero(
            aggregatedData.getEmissionsWithinUKPorts(),
            aerViolations,
            AerShipAggregatedData.class
        );

        AerValidatorHelper.validateEmissionsInputIsPositiveOrZero(
            aggregatedData.getEmissionsBetweenUKPorts(),
            aerViolations,
            AerShipAggregatedData.class
        );

        AerValidatorHelper.validateEmissionsInputIsPositiveOrZero(
            aggregatedData.getEmissionsBetweenUKAndNIVoyages(),
            aerViolations,
            AerShipAggregatedData.class
        );
    }
}
