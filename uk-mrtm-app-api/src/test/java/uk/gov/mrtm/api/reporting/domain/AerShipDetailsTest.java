package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
class AerShipDetailsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @MethodSource("validScenarios")
    void valid(AerShipDetails shipDetails) {
        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(shipDetails);

        assertFalse(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.all.year.exist}"));
    }

    public static Stream<AerShipDetails> validScenarios() {
        return Stream.of(
            AerShipDetails.builder().allYear(false).from(LocalDate.now()).to(LocalDate.now().plusDays(1)).build(),
            AerShipDetails.builder().allYear(true).build()
        );
    }

    @ParameterizedTest
    @MethodSource("invalidScenarios")
    void invalid(AerShipDetails shipDetails) {
        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(shipDetails);

        assertTrue(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.all.year.exist}"));
    }

    public static Stream<AerShipDetails> invalidScenarios() {
        return Stream.of(
            AerShipDetails.builder().allYear(true).from(LocalDate.now()).to(LocalDate.now().plusDays(1)).build(),
            AerShipDetails.builder().allYear(true).from(LocalDate.now()).build(),
            AerShipDetails.builder().allYear(true).to(LocalDate.now()).build(),
            AerShipDetails.builder().allYear(false).build(),
            AerShipDetails.builder().allYear(false).from(LocalDate.now()).build(),
            AerShipDetails.builder().allYear(false).to(LocalDate.now()).build(),
            AerShipDetails.builder().allYear(false).from(LocalDate.now()).to(LocalDate.now()).build(),
            AerShipDetails.builder().allYear(false).from(LocalDate.now().plusDays(1)).to(LocalDate.now()).build()
        );
    }

    @ParameterizedTest
    @EnumSource(value = IceClass.class, names = {"IC", "IB", "NA"})
    void when_hasIceClassDerogation_null(IceClass iceClass) {
        final AerShipDetails aerShipEmissions = AerShipDetails.builder().iceClass(iceClass).build();

        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(aerShipEmissions);

        assertFalse(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.ice.class.derogation.invalid}"));
    }

    @ParameterizedTest
    @EnumSource(value = IceClass.class, names = {"IC", "IB", "NA"}, mode = EnumSource.Mode.EXCLUDE)
    void when_hasIceClassDerogation_true(IceClass iceClass) {
        final AerShipDetails aerShipEmissions = AerShipDetails.builder().iceClass(iceClass).hasIceClassDerogation(true).build();

        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(aerShipEmissions);

        assertFalse(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.ice.class.derogation.invalid}"));
    }

    @ParameterizedTest
    @EnumSource(value = IceClass.class, names = {"IC", "IB", "NA"}, mode = EnumSource.Mode.EXCLUDE)
    void when_hasIceClassDerogation_false(IceClass iceClass) {
        final AerShipDetails aerShipEmissions = AerShipDetails.builder().iceClass(iceClass).hasIceClassDerogation(false).build();

        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(aerShipEmissions);

        assertFalse(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.ice.class.derogation.invalid}"));
    }

    @ParameterizedTest
    @EnumSource(value = IceClass.class, names = {"IC", "IB", "NA"}, mode = EnumSource.Mode.EXCLUDE)
    void when_hasIceClassDerogation_null_throws_error(IceClass iceClass) {
        final AerShipDetails aerShipEmissions = AerShipDetails.builder().iceClass(iceClass).build();

        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(aerShipEmissions);

        assertTrue(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.ice.class.derogation.invalid}"));
    }

    @ParameterizedTest
    @EnumSource(value = IceClass.class, names = {"IC", "IB", "NA"})
    void when_hasIceClassDerogation_true_throws_error(IceClass iceClass) {
        final AerShipDetails aerShipEmissions = AerShipDetails.builder().iceClass(iceClass).hasIceClassDerogation(true).build();

        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(aerShipEmissions);

        assertTrue(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.ice.class.derogation.invalid}"));
    }

    @ParameterizedTest
    @EnumSource(value = IceClass.class, names = {"IC", "IB", "NA"})
    void when_hasIceClassDerogation_false_throws_error(IceClass iceClass) {
        final AerShipDetails aerShipEmissions = AerShipDetails.builder().iceClass(iceClass).hasIceClassDerogation(false).build();

        final Set<ConstraintViolation<AerShipDetails>> violations = validator.validate(aerShipEmissions);

        assertTrue(violations.stream().map(ConstraintViolation::getMessage)
            .collect(Collectors.toSet())
            .contains("{aer.ship.details.ice.class.derogation.invalid}"));
    }
}