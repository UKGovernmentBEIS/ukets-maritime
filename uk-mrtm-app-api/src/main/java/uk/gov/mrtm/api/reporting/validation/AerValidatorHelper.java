package uk.gov.mrtm.api.reporting.validation;

import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.AerFuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.AerFuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.AerFuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes1;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes2;
import uk.gov.mrtm.api.reporting.enumeration.PortCodesNorthernIreland;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class AerValidatorHelper {

    private static final String UNEXPECTED_FUEL_TYPE =
            "Unexpected FuelsAndEmissionsFactors type: ";

    private AerValidatorHelper() {
    }


    public static FuelOriginTypeName buildFuelOriginTypeName(AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors) {
        return switch (fuelsAndEmissionsFactors) {
            case AerFossilFuels fossilFuels -> FuelOriginFossilTypeName.builder()
                .origin(fossilFuels.getOrigin())
                .type(fossilFuels.getType())
                .name(fossilFuels.getName())
                .build();
            case AerBioFuels bioFuels -> FuelOriginBiofuelTypeName.builder()
                .origin(bioFuels.getOrigin())
                .type(bioFuels.getType())
                .name(bioFuels.getName())
                .build();
            case AerEFuels eFuels -> FuelOriginEFuelTypeName.builder()
                .origin(eFuels.getOrigin())
                .type(eFuels.getType())
                .name(eFuels.getName())
                .build();
            default -> throw new IllegalStateException(UNEXPECTED_FUEL_TYPE
                + fuelsAndEmissionsFactors);
        };
    }

    public static FuelOriginTypeName buildFuelOriginTypeNameWithUuid(AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors) {
        return switch (fuelsAndEmissionsFactors) {
            case AerFossilFuels fossilFuels -> FuelOriginFossilTypeName.builder()
                .origin(fossilFuels.getOrigin())
                .type(fossilFuels.getType())
                .name(fossilFuels.getName())
                .uniqueIdentifier(fuelsAndEmissionsFactors.getUniqueIdentifier())
                .build();
            case AerBioFuels bioFuels -> FuelOriginBiofuelTypeName.builder()
                .origin(bioFuels.getOrigin())
                .type(bioFuels.getType())
                .name(bioFuels.getName())
                .uniqueIdentifier(fuelsAndEmissionsFactors.getUniqueIdentifier())
                .build();
            case AerEFuels eFuels -> FuelOriginEFuelTypeName.builder()
                .origin(eFuels.getOrigin())
                .type(eFuels.getType())
                .name(eFuels.getName())
                .uniqueIdentifier(fuelsAndEmissionsFactors.getUniqueIdentifier())
                .build();
            default -> throw new IllegalStateException(UNEXPECTED_FUEL_TYPE
                + fuelsAndEmissionsFactors);
        };
    }

    public static AerAggregatedDataFuelOriginTypeName buildAerFuelOriginTypeNameWithUuid(FuelOriginTypeName fuelOriginTypeName) {
        return switch (fuelOriginTypeName) {
            case FuelOriginFossilTypeName fossilFuels -> AerFuelOriginFossilTypeName.builder()
                .origin(fossilFuels.getOrigin())
                .type(fossilFuels.getType())
                .name(fossilFuels.getName())
                .uniqueIdentifier(fuelOriginTypeName.getUniqueIdentifier())
                .build();
            case FuelOriginBiofuelTypeName bioFuels -> AerFuelOriginBiofuelTypeName.builder()
                .origin(bioFuels.getOrigin())
                .type(bioFuels.getType())
                .name(bioFuels.getName())
                .uniqueIdentifier(fuelOriginTypeName.getUniqueIdentifier())
                .build();
            case FuelOriginEFuelTypeName eFuels -> AerFuelOriginEFuelTypeName.builder()
                .origin(eFuels.getOrigin())
                .type(eFuels.getType())
                .name(eFuels.getName())
                .uniqueIdentifier(fuelOriginTypeName.getUniqueIdentifier())
                .build();
            default -> throw new IllegalStateException(UNEXPECTED_FUEL_TYPE
                + fuelOriginTypeName);
        };
    }

    public static FuelOriginTypeName buildFuelOriginTypeName(AerAggregatedDataFuelOriginTypeName aerAggregatedDataFuelOriginTypeName) {
        return switch (aerAggregatedDataFuelOriginTypeName) {
            case AerFuelOriginFossilTypeName fossilFuels -> FuelOriginFossilTypeName.builder()
                .origin(fossilFuels.getOrigin())
                .type(fossilFuels.getType())
                .name(fossilFuels.getName())
                .build();
            case AerFuelOriginBiofuelTypeName bioFuels -> FuelOriginBiofuelTypeName.builder()
                .origin(bioFuels.getOrigin())
                .type(bioFuels.getType())
                .name(bioFuels.getName())
                .build();
            case AerFuelOriginEFuelTypeName eFuels -> FuelOriginEFuelTypeName.builder()
                .origin(eFuels.getOrigin())
                .type(eFuels.getType())
                .name(eFuels.getName())
                .build();
            default -> throw new IllegalStateException("Unexpected aerAggregatedDataFuelOriginTypeName type: "
                + aerAggregatedDataFuelOriginTypeName);
        };
    }

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

    private static FuelOriginTypeName buildFuelOriginTypeNameWithMethaneSlip(FuelOriginTypeName fuelOriginTypeName) {
        return switch (fuelOriginTypeName) {
            case FuelOriginFossilTypeName fossilFuels -> FuelOriginFossilTypeName.builder()
                    .origin(fossilFuels.getOrigin())
                    .type(fossilFuels.getType())
                    .name(fossilFuels.getName())
                    .methaneSlip(fossilFuels.getMethaneSlip())
                    .build();
            case FuelOriginBiofuelTypeName bioFuels -> FuelOriginBiofuelTypeName.builder()
                    .origin(bioFuels.getOrigin())
                    .type(bioFuels.getType())
                    .name(bioFuels.getName())
                    .methaneSlip(bioFuels.getMethaneSlip())
                    .build();
            case FuelOriginEFuelTypeName eFuels -> FuelOriginEFuelTypeName.builder()
                    .origin(eFuels.getOrigin())
                    .type(eFuels.getType())
                    .name(eFuels.getName())
                    .methaneSlip(eFuels.getMethaneSlip())
                    .build();
            default -> throw new IllegalStateException("Unexpected fuelOriginTypeName type: "
                    + fuelOriginTypeName);
        };
    }

    protected static Object[] extractAerViolations(final List<AerValidationResult> aerValidationResults) {
        return aerValidationResults.stream()
            .filter(aerValidationResult -> !aerValidationResult.isValid())
            .flatMap(aerValidationResult -> aerValidationResult.getAerViolations().stream())
            .toArray();
    }

    protected static void validateVisit(AerPortVisit visit, List<AerViolation> aerViolations, Class<?> className) {
        PortCodes1 portCode1 = PortCodes1.fromString(visit.getPort());
        PortCodes2 portCode2 = PortCodes2.fromString(visit.getPort());
        PortCodesNorthernIreland portCodesNorthernIreland = PortCodesNorthernIreland.fromString(visit.getPort());

        if (portCode1 == null && portCode2 == null && portCodesNorthernIreland == null) {
            aerViolations.add(new AerViolation(className.getSimpleName(),
                AerViolation.ViolationMessage.PORT_VISIT_INVALID_PORT_CODE, visit.getPort()));
        }

        if ((portCode1 != null && portCode1 != PortCodes1.NOT_APPLICABLE && !Objects.equals(portCode1.getCountry(), visit.getCountry()))
            ||
            (portCode2 != null && !Objects.equals(portCode2.getCountry(), visit.getCountry()))
            ||
            (portCodesNorthernIreland != null && !Objects.equals(portCodesNorthernIreland.getCountry(), visit.getCountry()))) {

            aerViolations.add(new AerViolation(className.getSimpleName(),
                AerViolation.ViolationMessage.PORT_VISIT_INVALID_PORT_COUNTRY, visit.getCountry()));
        }
    }

    protected static void validateArrivalAndDepartureYear(int arrivalYear, int departureYear, int aerYear,
                                                          List<AerViolation> aerViolations, Class<?> className) {
        if (arrivalYear != aerYear) {
            aerViolations.add(new AerViolation(className.getSimpleName(),
                AerViolation.ViolationMessage.ARRIVAL_YEAR_MISMATCH_AER_YEAR));
        }

        if (departureYear != aerYear) {
            aerViolations.add(new AerViolation(className.getSimpleName(),
                AerViolation.ViolationMessage.DEPARTURE_YEAR_MISMATCH_AER_YEAR));
        }
    }

    protected static void validateDirectEmissionsOrFuelConsumptionsExist(Set<AerFuelConsumption> fuelConsumptions,
                                                                         AerPortEmissionsMeasurement directEmissions,
                                                                         List<AerViolation> aerViolations,
                                                                         Class<?> className) {

        if (fuelConsumptions.isEmpty() && directEmissions == null) {
            aerViolations.add(new AerViolation(className.getSimpleName(),
                AerViolation.ViolationMessage.NO_DIRECT_EMISSIONS_OR_FUEL_CONSUMPTIONS));
        }
    }

    protected static void validateEmissionsInputIsPositiveOrZero(AerPortEmissionsMeasurement emissions,
                                                                 List<AerViolation> aerViolations,
                                                                 Class<?> className) {

        if (emissions != null &&
                (emissions.getCo2().compareTo(BigDecimal.ZERO) < 0 ||
                        emissions.getCh4().compareTo(BigDecimal.ZERO) < 0 ||
                        emissions.getN2o().compareTo(BigDecimal.ZERO) < 0)) {

                aerViolations.add(new AerViolation(className.getSimpleName(),
                    AerViolation.ViolationMessage.NEGATIVE_EMISSIONS_INPUT));
        }
    }

    protected static void validateShipExistsInListOfShips(AerShipEmissions ship, String imoNumber,
                                                          List<AerViolation> aerViolations, Class<?> className) {

        if (ship == null) {
            aerViolations.add(new AerViolation(className.getSimpleName(),
                AerViolation.ViolationMessage.SHIP_NOT_FOUND_IN_LIST_OF_SHIPS, imoNumber));
        }
    }

    protected static void validateFuelConsumptions(AerShipEmissions ship, Set<AerFuelConsumption> fuelConsumptions,
                                                   List<AerViolation> aerViolations, Class<?> className) {

        for (AerFuelConsumption fuelConsumption : fuelConsumptions) {
            boolean hasValidFuelConsumption = ship.getEmissionsSources()
                .stream()
                .anyMatch(emissionsSources ->
                    (fuelConsumption.getName() == null || emissionsSources.getName().equals(fuelConsumption.getName()))
                        && emissionsSources.getFuelDetails()
                        .stream()
                        .anyMatch(fuelOriginTypeName -> buildFuelOriginTypeNameWithMethaneSlip(fuelOriginTypeName).equals(buildFuelOriginTypeNameWithMethaneSlip(fuelConsumption.getFuelOriginTypeName())))
                );

            if (!hasValidFuelConsumption) {
                aerViolations.add(new AerViolation(className.getSimpleName(),
                    AerViolation.ViolationMessage.PORTS_FUEL_CONSUMPTION_METHANE_SLIP_OR_NAME_MISMATCH));
            }
        }
    }

}
