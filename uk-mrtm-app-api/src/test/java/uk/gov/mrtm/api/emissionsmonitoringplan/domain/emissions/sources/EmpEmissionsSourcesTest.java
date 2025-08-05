package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceType.MAIN_ENGINE;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod.BDN;

@ExtendWith(MockitoExtension.class)
class EmpEmissionsSourcesTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_emp_emissions_sources_invalid() {

        final EmpEmissionsSources empShipDetails = EmpEmissionsSources.builder().build();

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(6, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage())
            || "must not be empty".equals(violation.getMessage())
            || "{emp.emission.sources.methane.slip.exist}".equals(violation.getMessage())
            || "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_emp_emissions_sources_negative_methane_slip_valid() {

        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(BigDecimal.ZERO.negate(), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_emp_emissions_sources_valid_without_methane_slip() {

        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(null, FossilFuelType.METHANOL, BioFuelType.BIO_H2, EFuelType.E_DIESEL, null);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    @ParameterizedTest
    @MethodSource("validScenarios")
    void has_valid_methane_slip(BigDecimal value, FossilFuelType fossilFuelType,
                                BioFuelType bioFuelType, EFuelType efuelType, MethaneSlipValueType methaneSlipValueType) {
        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(value, fossilFuelType, bioFuelType, efuelType, methaneSlipValueType);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
            Arguments.of(new BigDecimal("1.1"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("1.1"), FossilFuelType.OTHER, BioFuelType.OTHER, EFuelType.OTHER, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("11.11"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("11.11"), FossilFuelType.OTHER, BioFuelType.OTHER, EFuelType.OTHER, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("11.1"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("11.1"), FossilFuelType.OTHER, BioFuelType.OTHER, EFuelType.OTHER, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("11"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("11"), FossilFuelType.OTHER, BioFuelType.OTHER, EFuelType.OTHER, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("1.11"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("1.11"), FossilFuelType.OTHER, BioFuelType.OTHER, EFuelType.OTHER, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("100"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("100"), FossilFuelType.OTHER, BioFuelType.OTHER, EFuelType.OTHER, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("0"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
            Arguments.of(new BigDecimal("0"), FossilFuelType.OTHER, BioFuelType.OTHER, EFuelType.OTHER, MethaneSlipValueType.OTHER)
        );
    }

    @ParameterizedTest
    @MethodSource("invalidScenarios")
    void has_invalid_methane_slip(BigDecimal value, FossilFuelType fossilFuelType,
                                  BioFuelType bioFuelType, EFuelType efuelType, MethaneSlipValueType methaneSlipValueType) {
        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(value, fossilFuelType, bioFuelType, efuelType, methaneSlipValueType);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(3, violations.size());
        assertThat(violations).allMatch(violation ->
            "numeric value out of bounds (<3 digits>.<2 digits> expected)".equals(violation.getMessage())
                || "must be less than or equal to 100".equals(violation.getMessage())
                || "must be greater than or equal to 0".equals(violation.getMessage()));
    }

    public static Stream<Arguments> invalidScenarios() {
        return Stream.of(
                Arguments.of(new BigDecimal("1.111"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
                Arguments.of(new BigDecimal("101"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
                Arguments.of(new BigDecimal("101.11"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
                Arguments.of(new BigDecimal("-1"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER)
        );
    }

    @ParameterizedTest
    @EnumSource(value = FossilFuelType.class, names = {"LNG", "OTHER"}, mode = EnumSource.Mode.EXCLUDE)
    void has_invalid_methane_slip_fossilFuel(FossilFuelType fossilFuelType) {
        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(new BigDecimal("1"), fossilFuelType, BioFuelType.BIO_LNG, EFuelType.E_LNG, null);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->"{emp.invalid.fuel.details.methane.slip}".equals(violation.getMessage()));
    }

    @ParameterizedTest
    @EnumSource(value = EFuelType.class, names = {"E_LNG", "OTHER"}, mode = EnumSource.Mode.EXCLUDE)
    void has_invalid_methane_slip_eFuel(EFuelType eFuelType) {
        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(new BigDecimal("1"), FossilFuelType.LNG, BioFuelType.BIO_LNG, eFuelType, null);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->"{emp.invalid.fuel.details.methane.slip}".equals(violation.getMessage()));
    }

    @ParameterizedTest
    @EnumSource(value = BioFuelType.class, names = {"BIO_LNG", "OTHER"}, mode = EnumSource.Mode.EXCLUDE)
    void has_invalid_methane_slip_bioFuel(BioFuelType bioFuelType) {
        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(new BigDecimal("1"), FossilFuelType.LNG, bioFuelType, EFuelType.E_LNG, null);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation ->"{emp.invalid.fuel.details.methane.slip}".equals(violation.getMessage()));
    }

    @ParameterizedTest
    @MethodSource("invalidMethaneSlipScenarios")
    void has_invalid_methane_slip_methane_slip_value_type(BigDecimal value, FossilFuelType fossilFuelType,
                                  BioFuelType bioFuelType, EFuelType efuelType, MethaneSlipValueType methaneSlipValueType) {
        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(value, fossilFuelType, bioFuelType, efuelType, methaneSlipValueType);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsOnly("{emp.invalid.fuel.details.methane.slip}");
    }

    public static Stream<Arguments> invalidMethaneSlipScenarios() {
        return Stream.of(
                Arguments.of(new BigDecimal("1.1"), FossilFuelType.METHANOL, BioFuelType.BIO_H2, EFuelType.E_H2, null),
                Arguments.of(null, FossilFuelType.METHANOL, BioFuelType.BIO_H2, EFuelType.E_H2, MethaneSlipValueType.OTHER),
                Arguments.of(new BigDecimal("1.1"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, null),
                Arguments.of(null, FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
                Arguments.of(null, FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, null),
                Arguments.of(null, FossilFuelType.METHANOL, BioFuelType.BIO_LNG, EFuelType.E_DIESEL, null),
                Arguments.of(new BigDecimal("1.1"), FossilFuelType.METHANOL, BioFuelType.BIO_LNG, EFuelType.E_DIESEL, null)
        );
    }

    @ParameterizedTest
    @MethodSource("validMethaneSlipScenarios")
    void has_valid_methane_slip_methane_slip_value_type(BigDecimal value, FossilFuelType fossilFuelType,
                                                          BioFuelType bioFuelType, EFuelType efuelType, MethaneSlipValueType methaneSlipValueType) {
        final EmpEmissionsSources empShipDetails = getEmpEmissionsSources(value, fossilFuelType, bioFuelType, efuelType, methaneSlipValueType);

        final Set<ConstraintViolation<EmpEmissionsSources>> violations = validator.validate(empShipDetails);

        assertEquals(0, violations.size());
    }

    public static Stream<Arguments> validMethaneSlipScenarios() {
        return Stream.of(
                Arguments.of(null, FossilFuelType.METHANOL, BioFuelType.BIO_H2, EFuelType.E_H2, null),
                Arguments.of(new BigDecimal("1.1"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.E_LNG, MethaneSlipValueType.OTHER),
                Arguments.of(new BigDecimal("1.1"), FossilFuelType.LNG, BioFuelType.BIO_LNG, EFuelType.OTHER, MethaneSlipValueType.PRESELECTED),
                Arguments.of(new BigDecimal("1.1"), FossilFuelType.OTHER, BioFuelType.BIO_LNG, EFuelType.OTHER, MethaneSlipValueType.PRESELECTED)
        );
    }

    private EmpEmissionsSources getEmpEmissionsSources(BigDecimal methaneSlip, FossilFuelType fossilFuelType,
                                                       BioFuelType bioFuelType, EFuelType efuelType, MethaneSlipValueType methaneSlipValueType) {
        return EmpEmissionsSources.builder()
            .referenceNumber("referenceNumber")
            .name("name")
            .type(MAIN_ENGINE)
            .sourceClass(EmissionSourceClass.BOILERS)
            .uniqueIdentifier(UUID.randomUUID())
            .fuelDetails(
                Set.of(
                    FuelOriginFossilTypeName.builder()
                        .uniqueIdentifier(UUID.randomUUID())
                        .origin(FuelOrigin.FOSSIL)
                        .type(fossilFuelType)
                        .methaneSlip(methaneSlip)
                        .methaneSlipValueType(methaneSlipValueType)
                        .build(),
                    FuelOriginBiofuelTypeName.builder()
                        .uniqueIdentifier(UUID.randomUUID())
                        .origin(FuelOrigin.BIOFUEL)
                        .type(bioFuelType)
                        .methaneSlipValueType(methaneSlipValueType)
                        .methaneSlip(methaneSlip)
                        .build(),
                    FuelOriginEFuelTypeName.builder()
                        .uniqueIdentifier(UUID.randomUUID())
                        .origin(FuelOrigin.RFNBO)
                        .type(efuelType)
                        .methaneSlip(methaneSlip)
                        .methaneSlipValueType(methaneSlipValueType)
                        .build()
                )
            )
            .monitoringMethod(Set.of(BDN))
            .build();
    }

}