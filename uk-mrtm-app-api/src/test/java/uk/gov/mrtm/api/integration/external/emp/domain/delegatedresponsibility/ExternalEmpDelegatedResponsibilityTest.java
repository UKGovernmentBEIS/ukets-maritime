package uk.gov.mrtm.api.integration.external.emp.domain.delegatedresponsibility;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ExternalEmpDelegatedResponsibilityTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_exists_valid() {
        final ExternalEmpDelegatedResponsibility delegatedResponsibility = ExternalEmpDelegatedResponsibility.builder()
            .delegatedResponsibilityUsed(true)
            .responsibilityDeclaration(true)
            .registeredOwners(Set.of(ExternalEmpRegisteredOwner.builder()
                .companyImoNumber("0000000")
                .name("name")
                .contactName("contact name")
                .email("email@email.com")
                .agreementDate(LocalDate.of(2025, 4, 26))
                .ships(Set.of(ExternalEmpRegisteredOwnerShipDetails.builder()
                    .name("ship name")
                    .shipImoNumber("1111111")
                    .build()))
                .build()))
            .build();
        final Set<ConstraintViolation<ExternalEmpDelegatedResponsibility>> violations = validator.validate(delegatedResponsibility);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_exists_true_invalid() {
        final ExternalEmpDelegatedResponsibility delegatedResponsibility = ExternalEmpDelegatedResponsibility.builder()
            .delegatedResponsibilityUsed(true)
            .build();
        final Set<ConstraintViolation<ExternalEmpDelegatedResponsibility>> violations = validator.validate(delegatedResponsibility);

        assertEquals(2, violations.size());
        assertThat(violations)
            .extracting(ConstraintViolation::getMessage)
            .containsExactlyInAnyOrder("{emp.external.mandate.delegatedResponsibilityUsed}", "{emp.external.mandate.responsibilityDeclaration}");
    }

    @Test
    void validate_exists_false_invalid() {
        final ExternalEmpDelegatedResponsibility delegatedResponsibility = ExternalEmpDelegatedResponsibility.builder()
            .delegatedResponsibilityUsed(false)
            .registeredOwners(Set.of(ExternalEmpRegisteredOwner.builder()
                .companyImoNumber("0000000")
                .name("name")
                .contactName("contact name")
                .email("email@email.com")
                .agreementDate(LocalDate.of(2025, 4, 26))
                .ships(Set.of(ExternalEmpRegisteredOwnerShipDetails.builder()
                    .name("ship name")
                    .shipImoNumber("1111111")
                    .build()))
                .build()))
            .build();
        final Set<ConstraintViolation<ExternalEmpDelegatedResponsibility>> violations = validator.validate(delegatedResponsibility);

        assertEquals(1, violations.size());
        assertThat(violations).extracting(ConstraintViolation::getMessage)
            .containsExactly("{emp.external.mandate.delegatedResponsibilityUsed}");
    }
}