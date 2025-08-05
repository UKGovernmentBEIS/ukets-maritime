package uk.gov.mrtm.api.account.service;

import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ReportingYearService {

    public static List<Year> calculateReportingYears(Year yearOfFirstMaritimeActivity) {
        Year currentYear = Year.now();

        return yearOfFirstMaritimeActivity.isAfter(currentYear) || yearOfFirstMaritimeActivity.equals(currentYear)
            ? List.of(currentYear)
            : IntStream.rangeClosed(yearOfFirstMaritimeActivity.getValue(), currentYear.getValue()).mapToObj(Year::of)
            .collect(Collectors.toList());
    }
}
