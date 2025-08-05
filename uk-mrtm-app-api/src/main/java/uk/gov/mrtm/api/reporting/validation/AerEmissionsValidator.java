package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.reporting.validation.AerValidatorHelper.buildFuelOriginTypeName;

@Service
@RequiredArgsConstructor
public class AerEmissionsValidator implements AerContextValidator {

    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        List<AerViolation> aerViolations = new ArrayList<>();

        boolean hasUniqueFuelNames =
            hasUniqueFuelNames(aerContainer.getAer().getEmissions().getShips());
        if (!hasUniqueFuelNames) {
            aerViolations.add(new AerViolation(AerEmissions.class.getSimpleName(),
                AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME));
        }

        Set<String> duplicateNames =
                getDuplicateEmissionSourceNames(aerContainer.getAer().getEmissions().getShips());

        if (!duplicateNames.isEmpty()) {
            aerViolations.add(new AerViolation(AerEmissions.class.getSimpleName(),
                    AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME,
                duplicateNames.toArray()));
        }

        boolean allFuelTypesAssociated =
            hasAllFuelTypesAssociated(aerContainer.getAer().getEmissions().getShips());

        if (!allFuelTypesAssociated) {
            aerViolations.add(new AerViolation(AerEmissions.class.getSimpleName(),
                AerViolation.ViolationMessage.FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES));
        }

        final Set<FuelOriginTypeName> invalidFuelOriginTypeNames =
            getDuplicateEmissionSourcesFuelTypes(aerContainer.getAer().getEmissions().getShips());
        if (!invalidFuelOriginTypeNames.isEmpty()) {
            aerViolations.add(new AerViolation(AerEmissions.class.getSimpleName(),
                    AerViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE,
                invalidFuelOriginTypeNames.toArray()));
        }


        final boolean areMonitoringMethodsSame =
                areMonitoringMethodsSame(aerContainer.getAer().getEmissions().getShips());
        if (!areMonitoringMethodsSame) {
            aerViolations.add(new AerViolation(AerEmissions.class.getSimpleName(),
                    AerViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS));
        }

        return AerValidationResult.builder()
                .valid(aerViolations.isEmpty())
                .aerViolations(aerViolations)
                .build();
    }

    private boolean hasUniqueFuelNames(Set<AerShipEmissions> ships) {
        return ships.stream().allMatch(
            aerShipEmissions -> {
                Set<Pair<String, String>> names = aerShipEmissions.getFuelsAndEmissionsFactors().stream()
                    .filter(e -> e.getName() == null)
                    .map(e -> Pair.of(e.getOrigin().name(), e.getTypeAsString()))
                    .collect(Collectors.toSet());

                Set<Pair<String, String>> otherNames = aerShipEmissions.getFuelsAndEmissionsFactors().stream()
                    .filter(e -> e.getName() != null)
                    .map(e -> Pair.of(e.getOrigin().name(), e.getName()))
                    .collect(Collectors.toSet());

                return (otherNames.size() + names.size()) == aerShipEmissions.getFuelsAndEmissionsFactors().size();
            }
        );
    }

    private boolean hasAllFuelTypesAssociated(Set<AerShipEmissions> ships) {
        return ships.stream().allMatch(
            aerShipEmissions -> {
                final Set<FuelOriginTypeName> fuelsAndEmissionsFactors = aerShipEmissions.getFuelsAndEmissionsFactors()
                    .stream()
                    .map(AerValidatorHelper::buildFuelOriginTypeName)
                    .collect(Collectors.toSet());

                final Set<FuelOriginTypeName> emissionSources = aerShipEmissions.getEmissionsSources()
                    .stream()
                    .flatMap(aerEmissionsSources -> aerEmissionsSources.getFuelDetails().stream())
                    .map(AerValidatorHelper::buildFuelOriginTypeName)
                    .collect(Collectors.toSet());

                return emissionSources.containsAll(fuelsAndEmissionsFactors);
            }
        );
    }

    private Set<String> getDuplicateEmissionSourceNames(Set<AerShipEmissions> ships) {
        Set<String> duplicateNames = new HashSet<>();
        ships.forEach(
            aerShipEmissions -> {
                Set<String> names = new HashSet<>();
                duplicateNames.addAll(
                        aerShipEmissions.getEmissionsSources()
                                .stream()
                                .map(EmissionsSources::getName)
                                .filter(name -> !names.add(name))
                                .collect(Collectors.toSet())
                );
            }
        );
        return duplicateNames;
    }

    private Set<FuelOriginTypeName> getDuplicateEmissionSourcesFuelTypes(Set<AerShipEmissions> ships) {
        Set<FuelOriginTypeName> invalidFuelOriginTypeNames = new HashSet<>();
        ships.forEach(
                aerShipEmissions -> {
                    final Set<FuelOriginTypeName> fuelOriginTypeNames = aerShipEmissions.getFuelsAndEmissionsFactors()
                            .stream()
                            .map(AerValidatorHelper::buildFuelOriginTypeName)
                            .collect(Collectors.toSet());

                    invalidFuelOriginTypeNames.addAll(
                            aerShipEmissions.getEmissionsSources().stream()
                                    .flatMap(emissionsSources -> emissionsSources.getFuelDetails().stream())
                                    .filter(fuelOriginTypeName ->
                                        !fuelOriginTypeNames.contains(buildFuelOriginTypeName(fuelOriginTypeName)))
                                    .collect(Collectors.toSet())
                    );
                }
        );
        return invalidFuelOriginTypeNames;
    }

    private boolean areMonitoringMethodsSame(Set<AerShipEmissions> ships) {
        return ships.stream().allMatch(ship -> {
            final Set<MonitoringMethod> existingMethods = extractMonitoringMethods(ship);
            final Set<MonitoringMethod> uncertaintyLevelMethods = ship.getUncertaintyLevel().stream()
                .map(UncertaintyLevel::getMonitoringMethod)
                .collect(Collectors.toSet());
            return uncertaintyLevelMethods.equals(existingMethods);
        });
    }

    private Set<MonitoringMethod> extractMonitoringMethods(AerShipEmissions ship) {
        return ship.getEmissionsSources().stream()
            .flatMap(emissionsSources -> emissionsSources.getMonitoringMethod().stream())
            .collect(Collectors.toSet());
    }
}