package uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AdditionalDocumentsTest {
    private Validator validator;

    private static final UUID DOCUMENT_ID = UUID.randomUUID();

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_additional_documents_exist_false_then_valid() {
        final AdditionalDocuments additionalDocuments = AdditionalDocuments.builder()
                .exist(false)
                .build();

        final Set<ConstraintViolation<AdditionalDocuments>> violations = validator.validate(additionalDocuments);

        assertEquals(0, violations.size());
    }

    @Test
    void when_additional_documents_exist_true_then_valid() {
        final AdditionalDocuments additionalDocuments = AdditionalDocuments.builder()
                .exist(true)
                .documents(Set.of(DOCUMENT_ID))
                .build();

        final Set<ConstraintViolation<AdditionalDocuments>> violations = validator.validate(additionalDocuments);

        assertEquals(0, violations.size());
    }

    @Test
    void when_additional_documents_exist_false_then_invalid() {
        final AdditionalDocuments additionalDocuments = AdditionalDocuments.builder()
                .exist(false)
                .documents(Set.of(DOCUMENT_ID))
                .build();

        final Set<ConstraintViolation<AdditionalDocuments>> violations = validator.validate(additionalDocuments);

        assertEquals(1, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactly("{emp.additional.documents.exist}");
    }

    @Test
    void when_additional_documents_exist_true_then_invalid() {
        final AdditionalDocuments additionalDocuments = AdditionalDocuments.builder()
                .exist(true)
                .build();

        final Set<ConstraintViolation<AdditionalDocuments>> violations = validator.validate(additionalDocuments);

        assertEquals(1, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactly("{emp.additional.documents.exist}");
    }

}
