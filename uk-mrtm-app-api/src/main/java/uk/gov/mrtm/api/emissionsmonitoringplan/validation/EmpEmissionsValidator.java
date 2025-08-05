package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.EmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpEmissionsValidator implements EmpContextValidator {

    @Override
    public EmissionsMonitoringPlanValidationResult validate(EmissionsMonitoringPlanContainer empContainer, Long accountId) {
        List<EmissionsMonitoringPlanViolation> empViolations = new ArrayList<>();

        boolean hasUniqueFuelNames =
            hasUniqueFuelNames(empContainer.getEmissionsMonitoringPlan().getEmissions().getShips());

        if (!hasUniqueFuelNames) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpEmissions.class.getSimpleName(),
                EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME));
        }

        Set<String> duplicateNames =
                getDuplicateEmissionSourceNames(empContainer.getEmissionsMonitoringPlan().getEmissions().getShips());

        if (!duplicateNames.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpEmissions.class.getSimpleName(),
                    EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME,
                duplicateNames.toArray()));
        }

        boolean allFuelTypesAssociated =
            hasAllFuelTypesAssociated(empContainer.getEmissionsMonitoringPlan().getEmissions().getShips());

        if (!allFuelTypesAssociated) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpEmissions.class.getSimpleName(),
                EmissionsMonitoringPlanViolation.ViolationMessage.FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES));
        }

        final Set<FuelOriginTypeName> invalidFuelOriginTypeNames =
            getDuplicateEmissionSourcesFuelTypes(empContainer.getEmissionsMonitoringPlan().getEmissions().getShips());
        if (!invalidFuelOriginTypeNames.isEmpty()) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpEmissions.class.getSimpleName(),
                    EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE,
                invalidFuelOriginTypeNames.toArray()));
        }


        final boolean areMonitoringMethodsSame =
                areMonitoringMethodsSame(empContainer.getEmissionsMonitoringPlan().getEmissions().getShips());
        if (!areMonitoringMethodsSame) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpEmissions.class.getSimpleName(),
                    EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS));
        }

        boolean hasInvalidCarbonTechnologies = hasValidCarbonTechnologyApplicationsFuelNames(
            empContainer.getEmissionsMonitoringPlan().getEmissions().getShips());
        if (!hasInvalidCarbonTechnologies) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpEmissions.class.getSimpleName(),
                EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_CARBON_TECHNOLOGIES_NAMES));
        }

        final boolean hasValidEmissionSources =
                hasValidEmissionSources(empContainer.getEmissionsMonitoringPlan().getEmissions().getShips());
        if (!hasValidEmissionSources) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpEmissions.class.getSimpleName(),
                    EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_MEASUREMENT_DESCRIPTION_EMISSION_SOURCES));
        }

        return EmissionsMonitoringPlanValidationResult.builder()
                .valid(empViolations.isEmpty())
                .empViolations(empViolations)
                .build();
    }

    private boolean hasUniqueFuelNames(Set<EmpShipEmissions> ships) {
        return ships.stream().allMatch(
            empShipEmissions -> {
                Set<Pair<String, String>> names = empShipEmissions.getFuelsAndEmissionsFactors().stream()
                    .filter(e -> e.getName() == null)
                    .map(e -> Pair.of(e.getOrigin().name(), e.getTypeAsString()))
                    .collect(Collectors.toSet());

                Set<Pair<String, String>> otherNames = empShipEmissions.getFuelsAndEmissionsFactors().stream()
                    .filter(e -> e.getName() != null)
                    .map(e -> Pair.of(e.getOrigin().name(), e.getName()))
                    .collect(Collectors.toSet());

                return (otherNames.size() + names.size()) == empShipEmissions.getFuelsAndEmissionsFactors().size();
            }
        );
    }

    private boolean hasAllFuelTypesAssociated(Set<EmpShipEmissions> ships) {
        return ships.stream().allMatch(
            empShipEmissions -> {
                final Set<FuelOriginTypeName> fuelsAndEmissionsFactors = empShipEmissions.getFuelsAndEmissionsFactors()
                    .stream()
                    .map(this::buildEmpFuelOriginTypeName)
                    .collect(Collectors.toSet());

                final Set<FuelOriginTypeName> emissionSources = empShipEmissions.getEmissionsSources()
                    .stream()
                    .flatMap(empEmissionsSources -> empEmissionsSources.getFuelDetails().stream())
                    .map(EmpEmissionsValidator::buildFuelOriginTypeName)
                    .collect(Collectors.toSet());

                return emissionSources.containsAll(fuelsAndEmissionsFactors);
            }
        );
    }

    private Set<String> getDuplicateEmissionSourceNames(Set<EmpShipEmissions> ships) {
        Set<String> duplicateNames = new HashSet<>();
        ships.forEach(
            empShipEmissions -> {
                Set<String> names = new HashSet<>();
                duplicateNames.addAll(
                        empShipEmissions.getEmissionsSources()
                                .stream()
                                .map(EmpEmissionsSources::getName)
                                .filter(name -> !names.add(name))
                                .collect(Collectors.toSet())
                );
            }
        );
        return duplicateNames;
    }

    private Set<FuelOriginTypeName> getDuplicateEmissionSourcesFuelTypes(Set<EmpShipEmissions> ships) {
        Set<FuelOriginTypeName> invalidFuelOriginTypeNames = new HashSet<>();
        ships.forEach(
                empShipEmissions -> {
                    final Set<FuelOriginTypeName> fuelOriginTypeNames = empShipEmissions.getFuelsAndEmissionsFactors()
                            .stream()
                            .map(this::buildEmpFuelOriginTypeName)
                            .collect(Collectors.toSet());

                    invalidFuelOriginTypeNames.addAll(
                            empShipEmissions.getEmissionsSources().stream()
                                    .flatMap(empEmissionsSources -> empEmissionsSources.getFuelDetails().stream())
                                    .filter(empFuelOriginTypeName -> !(fuelOriginTypeNames).contains(buildFuelOriginTypeName(empFuelOriginTypeName)))
                                    .collect(Collectors.toSet())
                    );
                }
        );
        return invalidFuelOriginTypeNames;
    }

    private FuelOriginTypeName buildEmpFuelOriginTypeName(EmpFuelsAndEmissionsFactors empFuelsAndEmissionsFactors) {
        return switch (empFuelsAndEmissionsFactors) {
            case EmpFossilFuels fossilFuels -> FuelOriginFossilTypeName.builder()
                .origin(fossilFuels.getOrigin())
                .type(fossilFuels.getType())
                .name(fossilFuels.getName())
                .build();
            case EmpBioFuels bioFuels -> FuelOriginBiofuelTypeName.builder()
                .origin(bioFuels.getOrigin())
                .type(bioFuels.getType())
                .name(bioFuels.getName())
                .build();
            case EmpEFuels eFuels -> FuelOriginEFuelTypeName.builder()
                .origin(eFuels.getOrigin())
                .type(eFuels.getType())
                .name(eFuels.getName())
                .build();
            default -> throw new IllegalStateException("Unexpected EmpFuelsAndEmissionsFactors type: "
                + empFuelsAndEmissionsFactors);
        };
    }

    // TODO refactor buildEmpFuelOriginTypeName, buildFuelOriginTypeName as well as AER related ones
    public static FuelOriginTypeName buildFuelOriginTypeName(FuelOriginTypeName fuelOriginTypeName) {
        return switch (fuelOriginTypeName) {
            case FuelOriginFossilTypeName fossilFuels -> FuelOriginFossilTypeName.builder()
                .origin(fossilFuels.getOrigin())
                .type(fossilFuels.getType())
                .name(fossilFuels.getName())
                .build();
            case FuelOriginBiofuelTypeName bioFuels -> FuelOriginBiofuelTypeName.builder()
                .origin(bioFuels.getOrigin())
                .type(bioFuels.getType())
                .name(bioFuels.getName())
                .build();
            case FuelOriginEFuelTypeName eFuels -> FuelOriginEFuelTypeName.builder()
                .origin(eFuels.getOrigin())
                .type(eFuels.getType())
                .name(eFuels.getName())
                .build();
            default -> throw new IllegalStateException("Unexpected fuelOriginTypeName type: "
                + fuelOriginTypeName);
        };
    }

    private boolean areMonitoringMethodsSame(Set<EmpShipEmissions> ships) {
        return ships.stream().allMatch(ship -> {
            final Set<MonitoringMethod> existingMethods = extractMonitoringMethods(ship);
            final Set<MonitoringMethod> uncertaintyLevelMethods = ship.getUncertaintyLevel().stream()
                .map(UncertaintyLevel::getMonitoringMethod)
                .collect(Collectors.toSet());
            return uncertaintyLevelMethods.equals(existingMethods);
        });
    }

    private Set<MonitoringMethod> extractMonitoringMethods(EmpShipEmissions ship) {
        return ship.getEmissionsSources().stream()
            .flatMap(emissionsSources -> emissionsSources.getMonitoringMethod().stream())
            .collect(Collectors.toSet());
    }

    private boolean hasValidCarbonTechnologyApplicationsFuelNames(Set<EmpShipEmissions> ships) {
        return ships.stream().allMatch(
            empShipEmissions -> {
                if (empShipEmissions.getCarbonCapture().getTechnologies() != null) {
                    Set<String> technologyApplications =
                        empShipEmissions.getCarbonCapture().getTechnologies().getTechnologyEmissionSources();

                    Set<String> emissionSourcesNames =
                        empShipEmissions.getEmissionsSources().stream()
                            .map(EmpEmissionsSources::getName)
                            .collect(Collectors.toSet());

                    return emissionSourcesNames.containsAll(technologyApplications);
                }

                return true;
            }
        );
    }

    private boolean hasValidEmissionSources(Set<EmpShipEmissions> ships) {
        return ships.stream().allMatch(ship -> {
            final Set<String> emissionSources = extractEmissionSources(ship);
            return ship.getMeasurements().stream()
                    .flatMap(measurementDescription -> measurementDescription.getEmissionSources().stream())
                    .allMatch(emissionSources::contains);
        });
    }

    private Set<String> extractEmissionSources(EmpShipEmissions ship) {
        return ship.getEmissionsSources().stream()
                .map(EmpEmissionsSources::getName)
                .collect(Collectors.toSet());
    }
}