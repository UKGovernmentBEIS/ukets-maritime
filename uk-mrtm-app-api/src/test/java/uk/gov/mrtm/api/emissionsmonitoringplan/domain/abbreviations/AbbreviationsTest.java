package uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AbbreviationsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_abbreviations_exist_false_then_valid() {
        final EmpAbbreviations additionalDocuments = EmpAbbreviations.builder()
                .exist(false)
                .build();

        final Set<ConstraintViolation<EmpAbbreviations>> violations = validator.validate(additionalDocuments);

        assertEquals(0, violations.size());
    }

    @Test
    void when_abbreviations_exist_true_then_valid() {
        final EmpAbbreviations additionalDocuments = EmpAbbreviations.builder()
                .exist(true)
                .abbreviationDefinitions(List.of(EmpAbbreviationDefinition.builder()
                                        .abbreviation("abbreviation 1")
                                        .definition("definition 1")
                                        .build(),
                                EmpAbbreviationDefinition.builder()
                                        .abbreviation("abbreviation 2")
                                        .definition("definition 2")
                                        .build()
                        )
                )
                .build();

        final Set<ConstraintViolation<EmpAbbreviations>> violations = validator.validate(additionalDocuments);

        assertEquals(0, violations.size());
    }

    @Test
    void when_abbreviations_exist_false_then_invalid() {
        final EmpAbbreviations additionalDocuments = EmpAbbreviations.builder()
                .exist(false)
                .abbreviationDefinitions(List.of(EmpAbbreviationDefinition.builder()
                        .abbreviation("abbreviation 1")
                        .definition("definition 1")
                        .build()))
                .build();

        final Set<ConstraintViolation<EmpAbbreviations>> violations = validator.validate(additionalDocuments);

        assertEquals(1, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactly("{emp.abbreviations.exist}");
    }

    @Test
    void when_abbreviations_exist_true_then_invalid() {
        final EmpAbbreviations additionalDocuments = EmpAbbreviations.builder()
                .exist(true)
                .build();

        final Set<ConstraintViolation<EmpAbbreviations>> violations = validator.validate(additionalDocuments);

        assertEquals(1, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactly("{emp.abbreviations.exist}");
    }

}
