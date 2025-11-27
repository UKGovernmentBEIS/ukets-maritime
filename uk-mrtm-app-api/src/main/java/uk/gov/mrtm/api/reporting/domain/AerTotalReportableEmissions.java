package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.constraints.Digits;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AerTotalReportableEmissions {

    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal surrenderEmissions;

    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal totalEmissions;

    @Digits(integer = Integer.MAX_VALUE, fraction = 0)
    private BigDecimal lessVoyagesInNorthernIrelandDeduction;
}
