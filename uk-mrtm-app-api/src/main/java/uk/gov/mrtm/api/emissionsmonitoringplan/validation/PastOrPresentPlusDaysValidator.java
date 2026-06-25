package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class PastOrPresentPlusDaysValidator implements ConstraintValidator<PastOrPresentPlusDays, LocalDate> {

    private int days;

    @Override
    public void initialize(PastOrPresentPlusDays constraintAnnotation) {
        this.days = constraintAnnotation.days();
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        LocalDate today = LocalDate.now(context.getClockProvider().getClock());
        return !value.isAfter(today.plusDays(days));
    }
}
