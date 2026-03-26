package uk.gov.mrtm.api.account.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.time.Year;

public class FirstMaritimeActivityDateValidator implements ConstraintValidator<ValidFirstMaritimeActivityDate, LocalDate> {

    @Value("${feature-flag.account.min.year.of.first.mrtm.activity}")
    private int year;

    @Override
    public boolean isValid(LocalDate dateToValidate, ConstraintValidatorContext context) {
        Year currentYear = Year.now();

        if (dateToValidate == null) {
            return true;
        }

        return dateToValidate.getYear() >= year && dateToValidate.getYear() <= currentYear.getValue();
    }
}