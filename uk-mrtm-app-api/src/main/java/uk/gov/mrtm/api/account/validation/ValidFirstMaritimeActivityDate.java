package uk.gov.mrtm.api.account.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = FirstMaritimeActivityDateValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidFirstMaritimeActivityDate {
    String message();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}