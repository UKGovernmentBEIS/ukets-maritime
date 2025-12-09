package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

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
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCapture;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCaptureTechnologies;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.measurementdescription.MeasurementDescription;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.MethaneSlipValueType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueElementsValidator;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation.ViolationMessage.FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_CARBON_TECHNOLOGIES_NAMES;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_MEASUREMENT_DESCRIPTION_EMISSION_SOURCES;

@ExtendWith(MockitoExtension.class)
class EmpEmissionsValidatorTest {
    private static final String IMO_NUMBER_1 = "1234567";
    private static final String IMO_NUMBER_2 = "7654321";
    private static final String OTHER_FUEL_NAME_1 = "fuel name1";
    private static final String OTHER_FUEL_NAME_2 = "fuel name2";
    private static final String EMISSION_SOURCES_NAME_1 = "emission source name1";
    private static final String EMISSION_SOURCES_NAME_2 = "emission source name2";
    private static final String EMISSION_SOURCES_NAME_3 = "emission source name3";
    private static final EFuelType E_FUEL_TYPE_1 = EFuelType.E_LNG;
    private static final EFuelType E_FUEL_TYPE_2 = EFuelType.E_H2;
    private static final Long ACCOUNT_ID = 1L;

    @InjectMocks
    private EmpEmissionsValidator validator;

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
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), Set.of(EMISSION_SOURCES_NAME_1), EMISSION_SOURCES_NAME_2, FuelOrigin.BIOFUEL,
            Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertTrue(result.isValid());
        assertThat(result.getEmpViolations()).isEmpty();
    }

    @Test
    void validate_duplicate_imo_number_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_1, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT),
            Set.of(EMISSION_SOURCES_NAME_1, EMISSION_SOURCES_NAME_2),EMISSION_SOURCES_NAME_2, FuelOrigin.BIOFUEL,
            Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        assertTrue(uniqueElementsValidator.validate(empContainer.getEmissionsMonitoringPlan().getEmissions()).stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("Unique elements constraint violation"));
    }

    @Test
    void validate_duplicate_emissions_fuel_name_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_1, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT),
            Set.of(EMISSION_SOURCES_NAME_1, EMISSION_SOURCES_NAME_2),EMISSION_SOURCES_NAME_2, FuelOrigin.FOSSIL,
            Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_FUEL_NAME.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(OTHER_FUEL_NAME_1).toArray());
    }

    @Test
    void validate_duplicate_emissions_fuel_name_case_insensitive_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_1.toLowerCase(Locale.ROOT), EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
                Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT),
                Set.of(EMISSION_SOURCES_NAME_1, EMISSION_SOURCES_NAME_2),EMISSION_SOURCES_NAME_2, FuelOrigin.FOSSIL,
                Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
                emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_FUEL_NAME.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(OTHER_FUEL_NAME_1).toArray());
    }

    @Test
    void validate_duplicate_emissions_source_name_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_1, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT),
            Set.of(EMISSION_SOURCES_NAME_1), EMISSION_SOURCES_NAME_1, FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_SOURCE_NAME.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(EMISSION_SOURCES_NAME_1).toArray());
    }

    @Test
    void validate_duplicate_emissions_source_name_case_insensitive_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_1.toLowerCase(Locale.ROOT), E_FUEL_TYPE_1,
                Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT),
                Set.of(EMISSION_SOURCES_NAME_1), EMISSION_SOURCES_NAME_1, FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
                emissionsMonitoringPlanViolation.getMessage().equals(DUPLICATE_EMISSIONS_SOURCE_NAME.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(EMISSION_SOURCES_NAME_1).toArray());
    }

    @Test
    void validate_invalid_emissions_sources_potential_fuel_type_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName2 = getFuelOriginEFuelTypeName(E_FUEL_TYPE_2);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_2,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT),
            Set.of(EMISSION_SOURCES_NAME_1, EMISSION_SOURCES_NAME_2),EMISSION_SOURCES_NAME_2, FuelOrigin.BIOFUEL,
            Set.of(fuelOriginEFuelTypeName, fuelOriginEFuelTypeName2));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(E_FUEL_TYPE_1.name()).toArray());
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
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), Set.of(EMISSION_SOURCES_NAME_1),
            EMISSION_SOURCES_NAME_2, FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
                emissionsMonitoringPlanViolation.getMessage().equals(FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(E_FUEL_TYPE_1.name()).toArray());
    }

    @Test
    void validate_missing_uncertainty_monitoring_methods_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK), Set.of(EMISSION_SOURCES_NAME_1, EMISSION_SOURCES_NAME_2),
            EMISSION_SOURCES_NAME_2, FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(MonitoringMethod.DIRECT.name()).toArray());
    }

    @Test
    void validate_uncertainty_monitoring_methods_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.FLOW_METERS),
            Set.of(EMISSION_SOURCES_NAME_1, EMISSION_SOURCES_NAME_2),EMISSION_SOURCES_NAME_2, FuelOrigin.BIOFUEL,
            Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS.getMessage()));

        assertThat(result.getEmpViolations()).hasSize(1);
        Set<Object> actualData = new HashSet<>(Arrays.asList((result.getEmpViolations().getFirst().getData())));
        Set<Object> expectedData = Set.of(MonitoringMethod.FLOW_METERS.name(), MonitoringMethod.DIRECT.name());
        assertThat(actualData).isEqualTo(expectedData);
    }

    @Test
    void validate_invalid_carbon_technologies_names_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2, E_FUEL_TYPE_1,
            Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT), Set.of(EMISSION_SOURCES_NAME_3),
            EMISSION_SOURCES_NAME_2, FuelOrigin.BIOFUEL, Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
            emissionsMonitoringPlanViolation.getMessage().equals(INVALID_CARBON_TECHNOLOGIES_NAMES.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(EMISSION_SOURCES_NAME_3).toArray());
    }

    @Test
    void validate_measurement_emissions_source_name_invalid() {
        FuelOriginEFuelTypeName fuelOriginEFuelTypeName = getFuelOriginEFuelTypeName(EFuelType.E_LNG);
        EmpEmissions empEmissions = createEmpEmissions(IMO_NUMBER_2, OTHER_FUEL_NAME_2, EMISSION_SOURCES_NAME_2,
            E_FUEL_TYPE_1, Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK, MonitoringMethod.DIRECT),
            Set.of(EMISSION_SOURCES_NAME_1, EMISSION_SOURCES_NAME_2), EMISSION_SOURCES_NAME_3, FuelOrigin.BIOFUEL,
            Set.of(fuelOriginEFuelTypeName));
        EmissionsMonitoringPlanContainer empContainer = createEmpContainer(empEmissions);

        EmissionsMonitoringPlanValidationResult result = validator.validate(empContainer, ACCOUNT_ID);

        assertFalse(result.isValid());
        assertThat(result.getEmpViolations()).allMatch(emissionsMonitoringPlanViolation ->
                emissionsMonitoringPlanViolation.getMessage().equals(INVALID_MEASUREMENT_DESCRIPTION_EMISSION_SOURCES.getMessage()));
        assertThat(result.getEmpViolations()).extracting(EmissionsMonitoringPlanViolation::getData)
            .containsExactlyInAnyOrder(Set.of(EMISSION_SOURCES_NAME_3).toArray());
    }

    private EmissionsMonitoringPlanContainer createEmpContainer(EmpEmissions NEW) {
        return EmissionsMonitoringPlanContainer
            .builder()
            .emissionsMonitoringPlan(
                EmissionsMonitoringPlan
                    .builder()
                    .emissions(NEW)
                    .build()
            )
            .build();
    }

    private EmpEmissions createEmpEmissions(String imoNumber2, String name2, String emissionSourcesName2,
                                            EFuelType eFuelType, Set<MonitoringMethod> monitoringMethods,
                                            Set<String> technologyApplications, String measurementEmissionSources,
                                            FuelOrigin origin2, Set<FuelOriginTypeName> fuelOriginEFuelTypeNames) {
        return EmpEmissions.builder()
            .ships(
                Set.of(
                    EmpShipEmissions.builder()
                        .details(ShipDetails.builder()
                            .imoNumber(EmpEmissionsValidatorTest.IMO_NUMBER_1)
                            .name("ship name 1")
                            .build()
                        )
                        .fuelsAndEmissionsFactors(
                            Set.of(
                                EmpFossilFuels.builder()
                                    .origin(FuelOrigin.FOSSIL)
                                    .type(FossilFuelType.OTHER)
                                    .name(OTHER_FUEL_NAME_1)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build(),
                                EmpBioFuels.builder()
                                    .origin(origin2)
                                    .type(BioFuelType.OTHER)
                                    .name(name2)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build(),
                                EmpEFuels.builder()
                                    .origin(FuelOrigin.RFNBO)
                                    .type(eFuelType)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build()
                            )
                        )
                        .emissionsSources(
                            Set.of(
                                EmpEmissionsSources.builder()
                                    .name(EMISSION_SOURCES_NAME_1)
                                    .referenceNumber("1")
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
                                                .methaneSlip(new BigDecimal("2"))
                                                .methaneSlipValueType(MethaneSlipValueType.PRESELECTED)
                                                .name(name2)
                                                .uniqueIdentifier(UUID.randomUUID())
                                                .build()
                                            )
                                    )
                                    .monitoringMethod(Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK))
                                    .build(),
                                EmpEmissionsSources.builder()
                                    .name(emissionSourcesName2)
                                    .referenceNumber("2")
                                    .fuelDetails(fuelOriginEFuelTypeNames)
                                    .monitoringMethod(Set.of(MonitoringMethod.DIRECT))
                                    .build()
                            )
                        )
                        .carbonCapture(EmpCarbonCapture.builder()
                            .exist(true)
                            .technologies(EmpCarbonCaptureTechnologies
                                .builder()
                                .technologyEmissionSources(technologyApplications)
                                .build()
                            )
                            .build()
                        )
                        .uncertaintyLevel(createEmpUncertaintyLevels(monitoringMethods))
                        .measurements(Set.of(
                                    MeasurementDescription.builder()
                                            .name("measurement description name 1")
                                            .emissionSources(Set.of(EMISSION_SOURCES_NAME_1))
                                            .build(),
                                    MeasurementDescription.builder()
                                            .name("measurement description name 2")
                                            .emissionSources(Set.of(measurementEmissionSources))
                                            .build(),
                                    MeasurementDescription.builder()
                                            .name("measurement description name 3")
                                            .emissionSources(Set.of(measurementEmissionSources))
                                            .build()
                            ))
                        .build(),
                    EmpShipEmissions.builder()
                        .details(ShipDetails.builder()
                            .imoNumber(imoNumber2)
                            .name("ship name 2")
                            .build()
                        )
                        .fuelsAndEmissionsFactors(
                            Set.of(
                                EmpFossilFuels.builder()
                                    .origin(FuelOrigin.FOSSIL)
                                    .type(FossilFuelType.OTHER)
                                    .name(OTHER_FUEL_NAME_1)
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .build()
                            )
                        )
                        .emissionsSources(
                            Set.of(
                                EmpEmissionsSources.builder()
                                    .name(EMISSION_SOURCES_NAME_1)
                                    .referenceNumber("3")
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
                        .uncertaintyLevel(createEmpUncertaintyLevels(monitoringMethods))
                        .carbonCapture(EmpCarbonCapture.builder()
                            .exist(false)
                            .build()
                        )
                        .measurements(Set.of(MeasurementDescription.builder()
                                            .name("measurement description name 4")
                                            .emissionSources(Set.of(EMISSION_SOURCES_NAME_1))
                                            .build(),
                                    MeasurementDescription.builder()
                                            .name("measurement description name 5")
                                            .emissionSources(Set.of(EMISSION_SOURCES_NAME_1))
                                            .build()))
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

    private Set<UncertaintyLevel> createEmpUncertaintyLevels(Set<MonitoringMethod> monitoringMethods) {
        return monitoringMethods.stream()
                .map(monitoringMethod -> UncertaintyLevel.builder()
                        .monitoringMethod(monitoringMethod)
                        .methodApproach(MethodApproach.SHIP_SPECIFIC)
                        .value(BigDecimal.valueOf(5.5))
                        .build())
                .collect(Collectors.toSet());
    }
}
