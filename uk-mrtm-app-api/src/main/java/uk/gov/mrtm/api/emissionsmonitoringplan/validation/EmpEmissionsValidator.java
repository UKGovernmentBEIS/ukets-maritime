package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EmpEmissionsValidator implements EmpContextValidator {

    @Override
    public EmissionsMonitoringPlanValidationResult validate(EmissionsMonitoringPlanContainer empContainer, Long accountId) {
        return validate(empContainer.getEmissionsMonitoringPlan().getEmissions());
    }

    public EmissionsMonitoringPlanValidationResult validate(EmpEmissions emissions) {
        List<EmissionsMonitoringPlanViolation> empViolations = new ArrayList<>();

        Set<EmpShipEmissions> ships = emissions.getShips();

        Set<String> duplicateFuelNames = getDuplicateFuelNames(ships);
        if (!duplicateFuelNames.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(
                "fuelTypes",
                EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME,
                duplicateFuelNames.toArray()));
        }

        Set<String> duplicateNames = getDuplicateEmissionSourceNames(ships);
        if (!duplicateNames.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(
                "emissionsSources",
                EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME,
                duplicateNames.toArray()));
        }

        Set<String> allFuelTypesAssociated = getUnAssociatedFuelTypes(ships);
        if (!allFuelTypesAssociated.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(
                "emissionsSources",
                EmissionsMonitoringPlanViolation.ViolationMessage.FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES,
                allFuelTypesAssociated.toArray()));
        }

        final Set<String> invalidFuelOriginTypeNames = getDuplicateEmissionSourcesFuelTypes(ships);
        if (!invalidFuelOriginTypeNames.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(
                "emissionsSources",
                EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE,
                invalidFuelOriginTypeNames.toArray()));
        }

        final Set<String> areMonitoringMethodsSame = getInvalidMonitoringMethods(ships);
        if (!areMonitoringMethodsSame.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(
                "uncertaintyLevel",
                EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS,
                areMonitoringMethodsSame.toArray()));
        }

        final Set<String> hasInvalidCarbonTechnologies = getValidCarbonTechnologyApplicationsFuelNames(ships);
        if (!hasInvalidCarbonTechnologies.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(
                "ccsCcu",
                EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_CARBON_TECHNOLOGIES_NAMES,
                hasInvalidCarbonTechnologies.toArray()));
        }

        final Set<String> hasValidEmissionSources = getValidEmissionSources(ships);
        if (!hasValidEmissionSources.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(
                "measuringEquipment",
                EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_MEASUREMENT_DESCRIPTION_EMISSION_SOURCES,
                hasValidEmissionSources.toArray()));
        }

        return EmissionsMonitoringPlanValidationResult.builder()
            .valid(empViolations.isEmpty())
            .empViolations(empViolations)
            .build();
    }

    private Set<String> getDuplicateFuelNames(Set<EmpShipEmissions> ships) {
        Set<String> duplicateFuels = new HashSet<>();

        ships.forEach(
            empShipEmissions -> {
                List<String> allNames = empShipEmissions.getFuelsAndEmissionsFactors().stream()
                    .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                    .toList();

                Set<String> seen = new HashSet<>();
                List<String> duplicates = allNames.stream()
                    .filter(str -> !seen.add(str))
                    .toList();

                duplicateFuels.addAll(duplicates);
            }
        );

        return duplicateFuels;
    }

    private Set<String> getUnAssociatedFuelTypes(Set<EmpShipEmissions> ships) {
        Set<String> unAssociatedFuels = new HashSet<>();

        ships.forEach(
            empShipEmissions -> {
                final Set<String> fuelsAndEmissionsFactors = empShipEmissions.getFuelsAndEmissionsFactors().stream()
                    .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                    .collect(Collectors.toSet());

                final Set<String> emissionSources = empShipEmissions.getEmissionsSources()
                    .stream()
                    .flatMap(empEmissionsSources -> empEmissionsSources.getFuelDetails().stream())
                    .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                    .collect(Collectors.toSet());

                fuelsAndEmissionsFactors.removeAll(emissionSources);
                unAssociatedFuels.addAll(fuelsAndEmissionsFactors);
            }
        );

        return unAssociatedFuels;
    }

    private Set<String> getDuplicateEmissionSourceNames(Set<EmpShipEmissions> ships) {
        Set<String> duplicateNames = new HashSet<>();

        ships.forEach(empShipEmissions -> {
            Set<String> namesSeen = new HashSet<>();

            duplicateNames.addAll(
                    empShipEmissions.getEmissionsSources().stream()
                            .map(EmpEmissionsSources::getName)
                            .filter(name -> !namesSeen.add(name.toLowerCase(Locale.ROOT)))
                            .collect(Collectors.toSet())
            );
        });

        return duplicateNames;
    }

    private Set<String> getDuplicateEmissionSourcesFuelTypes(Set<EmpShipEmissions> ships) {
        Set<String> invalidFuelOriginTypeNames = new HashSet<>();
        ships.forEach(
                empShipEmissions -> {
                    final Set<String> allFuelTypes = empShipEmissions.getFuelsAndEmissionsFactors()
                            .stream()
                            .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                            .collect(Collectors.toSet());

                    invalidFuelOriginTypeNames.addAll(
                            empShipEmissions.getEmissionsSources().stream()
                                    .flatMap(empEmissionsSources -> empEmissionsSources.getFuelDetails().stream())
                                    .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                                    .filter(fuelType -> !(allFuelTypes).contains(fuelType))
                                    .collect(Collectors.toSet())
                    );
                }
        );
        return invalidFuelOriginTypeNames;
    }

    private Set<String> getInvalidMonitoringMethods(Set<EmpShipEmissions> ships) {
        Set<String> invalidMethods = new HashSet<>();

        ships.forEach(ship -> {
            final Set<MonitoringMethod> existingMethods = ship.getEmissionsSources().stream()
                .flatMap(emissionsSources -> emissionsSources.getMonitoringMethod().stream())
                .collect(Collectors.toSet());

            final Set<MonitoringMethod> uncertaintyLevelMethods = ship.getUncertaintyLevel().stream()
                .map(UncertaintyLevel::getMonitoringMethod)
                .collect(Collectors.toSet());

            invalidMethods.addAll(Stream.concat(
                existingMethods.stream().filter(c->!uncertaintyLevelMethods.contains(c)),
                uncertaintyLevelMethods.stream().filter(c->!existingMethods.contains(c))
            ).map(Enum::name).collect(Collectors.toSet()));
        });

        return invalidMethods;
    }

    private Set<String> getValidCarbonTechnologyApplicationsFuelNames(Set<EmpShipEmissions> ships) {
        Set<String> invalidEmissionsSourcesNames = new HashSet<>();
        ships.forEach(
            empShipEmissions -> {
                if (empShipEmissions.getCarbonCapture().getTechnologies() != null) {
                    Set<String> emissionSourcesNames =
                        empShipEmissions.getEmissionsSources().stream()
                            .map(EmpEmissionsSources::getName)
                            .collect(Collectors.toSet());

                    Set<String> technologyApplications =
                        new HashSet<>(empShipEmissions.getCarbonCapture().getTechnologies().getTechnologyEmissionSources());

                    technologyApplications.removeAll(emissionSourcesNames);
                    invalidEmissionsSourcesNames.addAll(technologyApplications);
                }
            }
        );

        return invalidEmissionsSourcesNames;
    }

    private Set<String> getValidEmissionSources(Set<EmpShipEmissions> ships) {
        Set<String> invalidEmissionsSourcesNames = new HashSet<>();

        ships.forEach(ship -> {
            final Set<String> emissionSources = ship.getEmissionsSources().stream()
                .map(EmpEmissionsSources::getName)
                .collect(Collectors.toSet());

            final Set<String> emissionSourcesFromMeasurements = ship.getMeasurements().stream()
                .flatMap(measurementDescription -> measurementDescription.getEmissionSources().stream())
                .collect(Collectors.toSet());

            emissionSourcesFromMeasurements.removeAll(emissionSources);
            invalidEmissionsSourcesNames.addAll(emissionSourcesFromMeasurements);
        });

        return invalidEmissionsSourcesNames;
    }

    private String getUniqueFuelName(String otherName, String type) {
        return  ObjectUtils.defaultIfNull(
            otherName != null ? otherName.toLowerCase(Locale.ROOT) : null,
            type);
    }
}