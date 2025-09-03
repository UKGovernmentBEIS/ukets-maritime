package uk.gov.mrtm.api.reporting.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.CustomLocalValidatorFactoryBean;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.MethaneSlipValueType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueElementsValidator;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS;

@ExtendWith(MockitoExtension.class)
class AerEmissionsValidatorTest {
    private static final String IMO_NUMBER_1 = "1234567";
    private static final String IMO_NUMBER_2 = "7654321";
    private static final String OTHER_FUEL_NAME_1 = "name1";
    private static final String OTHER_FUEL_NAME_2 = "name2";
    private static final String EMISSION_SOURCES_NAME_1 = "name1";
    private static final String EMISSION_SOURCES_NAME_2 = "name2";
    private static final EFuelType E_FUEL_TYPE_1 = EFuelType.E_LNG;
    private static final EFuelType E_FUEL_TYPE_2 = EFuelType.E_H2;
    private static final Long ACCOUNT_ID = 1L;

    @InjectMocks
    private AerEmissionsValidator validator;

    private Validator uniqueElementsValidator;

    private final List<ConstraintValidator<?,?>> customConstraintValidators = Collections.singletonList(new UniqueElementsValidator());

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = new CustomLocalValidatorFactoryBean(customConstraintValidators)) {
            uniqueElementsValidator = factory.getValidator();
        }
    }

    @Test
    void validate_fuel_valid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getAerViolations()).isEmpty();
    }

    @Test
    void validate_duplicate_imo_number_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_1, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        assertTrue(uniqueElementsValidator.validate(aerContainer.getAer().getEmissions()).stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("Unique elements constraint violation"));
    }

    @Test
    void validate_duplicate_emissions_fuel_name_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_1, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.FOSSIL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_FUEL_NAME.getMessage()));
    }

    @Test
    void validate_duplicate_emissions_fuel_name_case_insensitive_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_1.toLowerCase(Locale.ROOT), EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
                Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.FOSSIL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
                emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_FUEL_NAME.getMessage()));
    }

    @Test
    void validate_duplicate_emissions_source_name_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_1, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_SOURCE_NAME.getMessage()));
    }

    @Test
    void validate_duplicate_emissions_source_name_case_insensitive_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_1.toLowerCase(Locale.ROOT), E_FUEL_TYPE_1,
                Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
                emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_SOURCE_NAME.getMessage()));
    }

    @Test
    void validate_invalid_emissions_sources_potential_fuel_type_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName2 = getFuelOriginEFuelTypeName(E_FUEL_TYPE_2);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_2,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.BIOFUEL,
            Set.of(fuelOriginEFuelTypeName, fuelOriginEFuelTypeName2));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE.getMessage()));
        assertThat(result.getAerViolations()).extracting(AerViolation::getData)
            .containsExactlyInAnyOrder(Set.of(fuelOriginEFuelTypeName).toArray());
    }

    @Test
    void validate_fuel_not_associated_with_emission_sources() {
        FuelOriginFossilTypeName fuelOriginEFuelTypeName = FuelOriginFossilTypeName.builder()
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.OTHER)
            .name(OTHER_FUEL_NAME_1)
            .methaneSlip(new BigDecimal("2"))
            .methaneSlipValueType(MethaneSlipValueType.PRESELECTED)
            .uniqueIdentifier(UUID.randomUUID())
            .build();
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES.getMessage()));
    }

    @Test
    void validate_missing_uncertainty_monitoring_methods_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK), FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS.getMessage()));
    }

    @Test
    void validate_uncertainty_monitoring_methods_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        AerEmissions aerEmissions = createAerEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.FLOW_METERS), FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        AerContainer aerContainer = createAerContainer(aerEmissions);

        AerValidationResult result = validator.validate(aerContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getAerViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS.getMessage()));
    }

    private AerContainer createAerContainer(AerEmissions NEW) {
        return AerContainer
            .builder()
            .aer(
                Aer
                    .builder()
                    .emissions(NEW)
                    .build()
            )
            .build();
    }

    private AerEmissions createAerEmissions(String imoNumber2, String name2, String emissionSourcesName2,
                                            EFuelType eFuelType, Set<MonitoringMethod> monitoringMethods,
                                            FuelOrigin origin2, Set<FuelOriginTypeName> fuelOriginEFuelTypeNames) {
        return AerEmissions.builder()
            .ships(
                Set.of(
                    AerShipEmissions.builder()
                        .details(AerShipDetails.builder()
                            .imoNumber(IMO_NUMBER_1)
                            .name("name1")
                            .build()
                        )
                        .fuelsAndEmissionsFactors(
                            Set.of(
                                AerFossilFuels.builder()
                                    .origin(FuelOrigin.FOSSIL)
                                    .type(FossilFuelType.OTHER)
                                    .name(OTHER_FUEL_NAME_1)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build(),
                                AerBioFuels.builder()
                                    .origin(origin2)
                                    .type(BioFuelType.OTHER)
                                    .name(name2)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build(),
                                AerEFuels.builder()
                                    .origin(FuelOrigin.RFNBO)
                                    .type(eFuelType)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build()
                            )
                        )
                        .emissionsSources(
                            Set.of(
                                EmissionsSources.builder()
                                    .name(EMISSION_SOURCES_NAME_1)
                                    .fuelDetails(
                                        Set.of(
                                            FuelOriginFossilTypeName.builder()
                                                .origin(FuelOrigin.FOSSIL)
                                                .type(FossilFuelType.OTHER)
                                                .name(OTHER_FUEL_NAME_1)
                                                .methaneSlip(new BigDecimal("2"))
                                                .methaneSlipValueType(MethaneSlipValueType.PRESELECTED)
                                                .uniqueIdentifier(UUID.randomUUID())
                                                .build(),
                                            FuelOriginBiofuelTypeName.builder()
                                                .origin(origin2)
                                                .type(BioFuelType.OTHER)
                                                .name(name2)
                                                .uniqueIdentifier(UUID.randomUUID())
                                                .build()
                                        )
                                    )
                                    .monitoringMethod(Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK))
                                    .build(),
                                EmissionsSources.builder()
                                    .name(emissionSourcesName2)
                                    .fuelDetails(fuelOriginEFuelTypeNames)
                                    .monitoringMethod(Set.of(MonitoringMethod.DIRECT))
                                    .build()
                            )
                        )
                        .uncertaintyLevel(createAerUncertaintyLevels(monitoringMethods))
                        .build(),
                    AerShipEmissions.builder()
                        .details(AerShipDetails.builder()
                            .imoNumber(imoNumber2)
                            .name("name2")
                            .build()
                        )
                        .fuelsAndEmissionsFactors(
                            Set.of(
                                AerFossilFuels.builder()
                                    .origin(FuelOrigin.FOSSIL)
                                    .type(FossilFuelType.OTHER)
                                    .name(OTHER_FUEL_NAME_1)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build()
                            )
                        )
                        .emissionsSources(
                            Set.of(
                                EmissionsSources.builder()
                                    .name(EMISSION_SOURCES_NAME_1)
                                    .monitoringMethod(Set.of(MonitoringMethod.BDN,MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT))
                                    .fuelDetails(
                                        Set.of(
                                            FuelOriginFossilTypeName.builder()
                                                .origin(FuelOrigin.FOSSIL)
                                                .type(FossilFuelType.OTHER)
                                                .name(OTHER_FUEL_NAME_1)
                                                .methaneSlip(new BigDecimal("1"))
                                                .methaneSlipValueType(MethaneSlipValueType.OTHER)
                                                .uniqueIdentifier(UUID.randomUUID())
                                                .build()
                                        )
                                    )
                                    .build()
                            )
                        )
                        .uncertaintyLevel(createAerUncertaintyLevels(monitoringMethods))
                        .build()
                )
            )
            .build();
    }

    private FuelOriginEFuelTypeName getFuelOriginEFuelTypeName(EFuelType fuelType) {
        return FuelOriginEFuelTypeName.builder()
            .origin(FuelOrigin.RFNBO)
            .type(fuelType)
            .methaneSlip(new BigDecimal("1"))
            .methaneSlipValueType(MethaneSlipValueType.OTHER)
            .uniqueIdentifier(UUID.randomUUID())
            .build();
    }

    private Set<UncertaintyLevel> createAerUncertaintyLevels(Set<MonitoringMethod> monitoringMethods) {
        return monitoringMethods.stream()
            .map(monitoringMethod -> UncertaintyLevel.builder()
                .monitoringMethod(monitoringMethod)
                .methodApproach(MethodApproach.SHIP_SPECIFIC)
                .value(BigDecimal.valueOf(5.5))
                .build())
            .collect(Collectors.toSet());
    }
}
