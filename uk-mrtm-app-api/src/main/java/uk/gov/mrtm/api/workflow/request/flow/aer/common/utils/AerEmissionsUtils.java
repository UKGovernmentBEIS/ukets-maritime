package uk.gov.mrtm.api.workflow.request.flow.aer.common.utils;

import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;
import lombok.experimental.UtilityClass;

import java.math.BigDecimal;
import java.math.RoundingMode;

@UtilityClass
public class AerEmissionsUtils {

    public static AerTotalReportableEmissions getAerTotalReportableEmissions(AerTotalEmissions totalEmissions) {
        final BigDecimal totalShipEmissions = totalEmissions.getTotalShipEmissionsSummary();
        final BigDecimal surrenderEmissions = totalEmissions.getSurrenderEmissionsSummary();
        final BigDecimal lessIslandFerryDeduction = totalEmissions.getLessVoyagesInNorthernIrelandDeduction().getTotal().setScale(0, RoundingMode.HALF_UP);

        return AerTotalReportableEmissions.builder()
            .totalEmissions(totalShipEmissions)
            .surrenderEmissions(surrenderEmissions)
            .lessVoyagesInNorthernIrelandDeduction(lessIslandFerryDeduction)
            .build();
    }

}
