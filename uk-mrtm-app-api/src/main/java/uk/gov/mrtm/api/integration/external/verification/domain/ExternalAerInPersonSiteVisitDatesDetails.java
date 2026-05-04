package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExternalAerInPersonSiteVisitDatesDetails {

    @NotNull
    @PastOrPresent
    @Schema(description = "Visit start date")
    private LocalDate startDate;

    @NotNull
    @Positive
    @Schema(description = "Number of days the team was on site")
    private Integer numberOfDays;
}
