package uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpMandateTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_exists_valid() {
        final EmpMandate mandate = EmpMandate.builder()
                .exist(Boolean.TRUE)
                .registeredOwners(Set.of(EmpRegisteredOwner.builder()
                        .uniqueIdentifier(UUID.randomUUID())
                        .imoNumber("0000000")
                        .name("name")
                        .contactName("contact name")
                        .email("email@email.com")
                        .effectiveDate(LocalDate.of(2025, 4, 26))
                        .ships(Set.of(RegisteredOwnerShipDetails.builder()
                                .name("ship name")
                                .imoNumber("1111111")
                                .build()))
                        .build()))
                .responsibilityDeclaration(Boolean.TRUE)
                .build();
        final Set<ConstraintViolation<EmpMandate>> violations = validator.validate(mandate);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_not_exists_valid() {
        final EmpMandate mandate = EmpMandate.builder()
                .exist(Boolean.FALSE)
                .build();
        final Set<ConstraintViolation<EmpMandate>> violations = validator.validate(mandate);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_not_exists_invalid() {
        final EmpMandate mandate = EmpMandate.builder()
                .exist(Boolean.FALSE)
                .registeredOwners(Set.of(EmpRegisteredOwner.builder()
                        .uniqueIdentifier(UUID.randomUUID())
                        .imoNumber("0000000")
                        .name("name")
                        .contactName("contact name")
                        .email("email@email.com")
                        .effectiveDate(LocalDate.of(2025, 4, 26))
                        .ships(Set.of(RegisteredOwnerShipDetails.builder()
                                .name("ship name")
                                .imoNumber("1111111")
                                .build()))
                        .build()))
                .responsibilityDeclaration(Boolean.TRUE)
                .build();
        final Set<ConstraintViolation<EmpMandate>> violations = validator.validate(mandate);

        assertEquals(2, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactlyInAnyOrder("{emp.mandate.exist}", "{emp.mandate.responsibilityDeclaration}");
    }

    @Test
    void validate_exists_invalid() {
        final EmpMandate mandate = EmpMandate.builder()
                .exist(Boolean.TRUE)
                .build();
        final Set<ConstraintViolation<EmpMandate>> violations = validator.validate(mandate);

        assertEquals(2, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactlyInAnyOrder("{emp.mandate.exist}", "{emp.mandate.responsibilityDeclaration}");
    }

    @Test
    void validate_exists_false_responsibility_invalid() {
        final EmpMandate mandate = EmpMandate.builder()
                .exist(Boolean.TRUE)
                .registeredOwners(Set.of(EmpRegisteredOwner.builder()
                        .uniqueIdentifier(UUID.randomUUID())
                        .imoNumber("0000000")
                        .name("name")
                        .contactName("contact name")
                        .email("email@email.com")
                        .effectiveDate(LocalDate.of(2025, 4, 26))
                        .ships(Set.of(RegisteredOwnerShipDetails.builder()
                                .name("ship name")
                                .imoNumber("1111111")
                                .build()))
                        .build()))
                .responsibilityDeclaration(Boolean.FALSE)
                .build();
        final Set<ConstraintViolation<EmpMandate>> violations = validator.validate(mandate);

        assertEquals(1, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactlyInAnyOrder("{emp.mandate.responsibilityDeclaration}");
    }
}
