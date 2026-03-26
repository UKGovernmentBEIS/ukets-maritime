package uk.gov.mrtm.api.account.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Year;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class MrtmAccountReportingYearsUpdatedEvent {

    private Long accountId;
    private List<Year> reportingYears;
}
