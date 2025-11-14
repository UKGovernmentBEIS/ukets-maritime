package uk.gov.mrtm.api.reporting.domain.common;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AerEmissionsReductionData {

    @NotNull
    private LocalDateTime arrivalTime;

    @NotNull
    private LocalDateTime departureTime;
}
