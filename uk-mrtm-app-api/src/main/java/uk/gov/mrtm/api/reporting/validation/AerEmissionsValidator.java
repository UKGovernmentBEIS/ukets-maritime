package uk.gov.mrtm.api.reporting.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static uk.gov.mrtm.api.reporting.validation.AerValidatorHelper.getUniqueFuelName;

@Service
@RequiredArgsConstructor
public class AerEmissionsValidator implements AerContextValidator {

    @Override
    public AerValidationResult validate(AerContainer aerContainer, Long accountId) {
        return validate(aerContainer.getAer().getEmissions());
    }

    public AerValidationResult validate(AerEmissions emissions) {
        List<AerViolation> aerViolations = new ArrayList<>();

        Set<AerShipEmissions> ships = emissions.getShips();

        Set<String> duplicateFuelNames =
            getDuplicateFuelNames(ships);
        if (!duplicateFuelNames.isEmpty()) {
            aerViolations.add(new AerViolation(
                "fuelTypes",
                AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME,
                duplicateFuelNames.toArray()));
        }

        Set<String> duplicateNames = getDuplicateEmissionSourceNames(ships);

        if (!duplicateNames.isEmpty()) {
            aerViolations.add(new AerViolation(
                "emissionsSources",
                AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME,
                duplicateNames.toArray()));
        }

        Set<String> allFuelTypesAssociated = getUnAssociatedFuelTypes(ships);
        if (!allFuelTypesAssociated.isEmpty()) {
            aerViolations.add(new AerViolation(
                "emissionsSources",
                AerViolation.ViolationMessage.FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES,
                allFuelTypesAssociated.toArray()));
        }

        final Set<String> invalidFuelOriginTypeNames = getDuplicateEmissionSourcesFuelTypes(ships);
        if (!invalidFuelOriginTypeNames.isEmpty()) {
            aerViolations.add(new AerViolation(
                "emissionsSources",
                AerViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE,
                invalidFuelOriginTypeNames.toArray()));
        }


        final Set<String> areMonitoringMethodsSame = getInvalidMonitoringMethods(ships);
        if (!areMonitoringMethodsSame.isEmpty()) {
            aerViolations.add(new AerViolation(
                "uncertaintyLevel",
                AerViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS,
                areMonitoringMethodsSame.toArray()));
        }

        return AerValidationResult.builder()
                .valid(aerViolations.isEmpty())
                .aerViolations(aerViolations)
                .build();
    }

    private Set<String> getDuplicateFuelNames(Set<AerShipEmissions> ships) {
        Set<String> duplicateFuels = new HashSet<>();

        ships.forEach(
            aerShipEmissions -> {
                List<String> allNames = aerShipEmissions.getFuelsAndEmissionsFactors().stream()
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

    private Set<String> getUnAssociatedFuelTypes(Set<AerShipEmissions> ships) {
        Set<String> unAssociatedFuels = new HashSet<>();

        ships.forEach(
            aerShipEmissions -> {
                final Set<String> fuelsAndEmissionsFactors = aerShipEmissions.getFuelsAndEmissionsFactors().stream()
                    .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                    .collect(Collectors.toSet());

                final Set<String> emissionSources = aerShipEmissions.getEmissionsSources()
                    .stream()
                    .flatMap(aerEmissionsSources -> aerEmissionsSources.getFuelDetails().stream())
                    .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                    .collect(Collectors.toSet());

                fuelsAndEmissionsFactors.removeAll(emissionSources);
                unAssociatedFuels.addAll(fuelsAndEmissionsFactors);
            }
        );

        return unAssociatedFuels;
    }

    private Set<String> getDuplicateEmissionSourceNames(Set<AerShipEmissions> ships) {
        Set<String> duplicateNames = new HashSet<>();

        ships.forEach(aerShipEmissions -> {
            Set<String> namesSeen = new HashSet<>();

            duplicateNames.addAll(
                    aerShipEmissions.getEmissionsSources().stream()
                            .map(EmissionsSources::getName)
                            .filter(name -> !namesSeen.add(name.toLowerCase(Locale.ROOT)))
                            .collect(Collectors.toSet())
            );
        });

        return duplicateNames;
    }

    private Set<String> getDuplicateEmissionSourcesFuelTypes(Set<AerShipEmissions> ships) {
        Set<String> invalidFuelOriginTypeNames = new HashSet<>();
        ships.forEach(
                aerShipEmissions -> {
                    final Set<String> allFuelTypes = aerShipEmissions.getFuelsAndEmissionsFactors()
                        .stream()
                        .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                        .collect(Collectors.toSet());

                    invalidFuelOriginTypeNames.addAll(
                        aerShipEmissions.getEmissionsSources().stream()
                            .flatMap(aerEmissionsSources -> aerEmissionsSources.getFuelDetails().stream())
                            .map(e -> getUniqueFuelName(e.getName(), e.getTypeAsString()))
                            .filter(fuelType -> !(allFuelTypes).contains(fuelType))
                            .collect(Collectors.toSet())
                    );
                }
        );
        return invalidFuelOriginTypeNames;
    }

    private Set<String> getInvalidMonitoringMethods(Set<AerShipEmissions> ships) {
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
}