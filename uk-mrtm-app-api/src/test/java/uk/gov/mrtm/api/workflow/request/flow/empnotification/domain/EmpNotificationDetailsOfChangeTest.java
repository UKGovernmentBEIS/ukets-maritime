package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

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
class EmpNotificationDetailsOfChangeTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validModel() {
        EmpNotificationDetailsOfChange empNotificationDetailsOfChange = EmpNotificationDetailsOfChange.builder()
                .description("description")
                .justification("justification")
                .build();

        Set<ConstraintViolation<EmpNotificationDetailsOfChange>> violations =
                validator.validate(empNotificationDetailsOfChange);

        assertThat(violations.size()).isZero();
    }

    @Test
    void inValidModel() {
        EmpNotificationDetailsOfChange empNotificationDetailsOfChange =
                EmpNotificationDetailsOfChange.builder().build();

        Set<ConstraintViolation<EmpNotificationDetailsOfChange>> violations =
                validator.validate(empNotificationDetailsOfChange);

        assertThat(violations.size()).isEqualTo(2);
        Assertions.assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

}
