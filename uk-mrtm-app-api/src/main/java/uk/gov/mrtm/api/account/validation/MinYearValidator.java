package uk.gov.mrtm.api.account.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;

public class MinYearValidator implements ConstraintValidator<MinYear, LocalDate> {

    @Value("${feature-flag.account.min.year.of.first.mrtm.activity}")
    private int year;

    @Override
    public boolean isValid(LocalDate dateToValidate, ConstraintValidatorContext context) {
        if (dateToValidate == null) {
            return true;
        }
        return dateToValidate.getYear() >= year;
    }
}