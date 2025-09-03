package uk.gov.mrtm.api.account.service;

import lombok.experimental.UtilityClass;

import java.time.Year;
import java.util.List;
import java.util.stream.IntStream;

@UtilityClass
public class ReportingYearService {

    public static List<Year> calculateReportingYears(Year yearOfFirstMaritimeActivity) {
        Year currentYear = Year.now();

        return yearOfFirstMaritimeActivity.isAfter(currentYear) || yearOfFirstMaritimeActivity.equals(currentYear)
                ? List.of(currentYear)
                : IntStream.rangeClosed(yearOfFirstMaritimeActivity.getValue(), currentYear.getValue()).mapToObj(Year::of)
                .toList();
    }
}
