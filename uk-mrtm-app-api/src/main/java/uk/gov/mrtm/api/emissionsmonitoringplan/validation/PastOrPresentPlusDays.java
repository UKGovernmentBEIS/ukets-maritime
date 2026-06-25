package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PastOrPresentPlusDaysValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface PastOrPresentPlusDays {

    String message() default "must be a date in the past, present, or within the allowed number of future days";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int days() default 1;
}
