package uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;

import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpControlActivitiesTest {
    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @ParameterizedTest
    @MethodSource("blankOrNullStrings")
    void when_control_activities_exist_false_then_valid(String optionalValue) {
        final EmpControlActivities empControlActivities = EmpControlActivities.builder()
                .qualityAssurance(createValidEmpProcedureForm(optionalValue))
                .internalReviews(createValidEmpProcedureForm(optionalValue))
                .corrections(createValidEmpProcedureForm(optionalValue))
                .outsourcedActivities(createValidEmpOutsourcedActivities(optionalValue))
                .documentation(createValidEmpProcedureForm(optionalValue))
                .build();

        final Set<ConstraintViolation<EmpControlActivities>> violations = validator.validate(empControlActivities);

        assertEquals(0, violations.size());
    }

    @Test
    void when_control_activities_are_all_null_then_invalid() {
        final EmpControlActivities empControlActivities = EmpControlActivities.builder().build();

        final Set<ConstraintViolation<EmpControlActivities>> violations = validator.validate(empControlActivities);

        assertEquals(5, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void when_control_activities_are_all_empty_then_invalid() {
        final EmpControlActivities empControlActivities = EmpControlActivities.builder()
                .qualityAssurance(EmpProcedureForm.builder().build())
                .internalReviews(EmpProcedureForm.builder().build())
                .corrections(EmpProcedureForm.builder().build())
                .outsourcedActivities(EmpOutsourcedActivities.builder()
                        .exist(true)
                        .details(EmpProcedureForm.builder().build())
                        .build())
                .documentation(EmpProcedureForm.builder().build())
                .build();

        final Set<ConstraintViolation<EmpControlActivities>> violations = validator.validate(empControlActivities);

        assertEquals(20, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void when_outsourced_activities_exist_but_empty_then_invalid() {
        final EmpControlActivities empControlActivities = EmpControlActivities.builder()
                .qualityAssurance(createValidEmpProcedureForm(null))
                .internalReviews(createValidEmpProcedureForm(null))
                .corrections(createValidEmpProcedureForm(null))
                .outsourcedActivities(EmpOutsourcedActivities.builder()
                        .exist(false)
                        .details(createValidEmpProcedureForm(null))
                        .build())
                .documentation(createValidEmpProcedureForm(null))
                .build();

        final Set<ConstraintViolation<EmpControlActivities>> violations = validator.validate(empControlActivities);

        assertEquals(1, violations.size());
        assertThat(violations)
                .extracting(ConstraintViolation::getMessage)
                .containsExactly("{emp.outsourced.activities.exist}");
    }

    private EmpProcedureForm createValidEmpProcedureForm(String optionalValue) {
        return EmpProcedureForm.builder()
                .reference("reference")
                .version(optionalValue)
                .description("description")
                .responsiblePersonOrPosition("responsiblePersonOrPosition")
                .recordsLocation("recordsLocation")
                .itSystemUsed(optionalValue)
                .build();
    }

    private EmpOutsourcedActivities createValidEmpOutsourcedActivities(String itSystemUsed) {
        return EmpOutsourcedActivities.builder()
                .exist(true)
                .details(createValidEmpProcedureForm(itSystemUsed))
                .build();
    }

    static Stream<String> blankOrNullStrings() {
        return Stream.of("itSystemUsed", null);
    }

}
