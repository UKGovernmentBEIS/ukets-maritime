package uk.gov.mrtm.api.reporting.domain.verification;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class AerMaterialityLevelTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_other_is_not_included_then_is_valid() {
        AerMaterialityLevel aerMaterialityLevel = AerMaterialityLevel.builder()
            .materialityDetails("materialityDetails")
            .accreditationReferenceDocumentTypes(Set.of(AerAccreditationReferenceDocumentType.EN_ISO_14064_3_2019,
                AerAccreditationReferenceDocumentType.AUTHORITY_GUIDANCE))
            .build();

        Set<ConstraintViolation<AerMaterialityLevel>> violations =
            validator.validate(aerMaterialityLevel);

        assertThat(violations.size()).isZero();
    }


    @Test
    void when_other_is_not_included_and_other_reason_is_then_is_invalid() {
        AerMaterialityLevel aerMaterialityLevel = AerMaterialityLevel.builder()
            .materialityDetails("materialityDetails")
            .otherReference("otherReference")
            .accreditationReferenceDocumentTypes(Set.of(AerAccreditationReferenceDocumentType.EN_ISO_14064_3_2019,
                AerAccreditationReferenceDocumentType.AUTHORITY_GUIDANCE))
            .build();

        Set<ConstraintViolation<AerMaterialityLevel>> violations =
            validator.validate(aerMaterialityLevel);

        assertThat(violations.size()).isEqualTo(1);
        Assertions.assertThat(violations).allMatch(violation ->
            "{aerVerificationData.materialityLevel.otherReference}".equals(violation.getMessage()));
    }

    @Test
    void when_other_is_included_then_is_valid() {
        AerMaterialityLevel aerMaterialityLevel = AerMaterialityLevel.builder()
            .materialityDetails("materialityDetails")
            .accreditationReferenceDocumentTypes(Set.of(AerAccreditationReferenceDocumentType.OTHER, AerAccreditationReferenceDocumentType.EN_ISO_14064_3_2019))
            .otherReference("otherReference")
            .build();

        Set<ConstraintViolation<AerMaterialityLevel>> violations =
            validator.validate(aerMaterialityLevel);

        assertThat(violations.size()).isZero();
    }
}