package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.calculateEmissionTotals;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.sumAndScale;

@Service
@RequiredArgsConstructor
public class AerPortEmissionsCalculator {

    public void calculateEmissions(Aer aer) {
        if (aer == null || aer.getEmissions() == null || aer.getPortEmissions() == null) {
            return;
        }

        for (AerPort port : aer.getPortEmissions().getPorts()) {
            Optional<AerShipEmissions> shipEmissionsOptional =
                    AerEmissionsCalculatorUtils.findShipEmissions(aer.getEmissions().getShips(), port.getImoNumber());

            if (shipEmissionsOptional.isPresent()) {
                processPortEmissions(port, shipEmissionsOptional.get());
            }
        }
    }

    private void processPortEmissions(AerPort port, AerShipEmissions shipEmissions) {
        BigDecimal co2Total = BigDecimal.ZERO;
        BigDecimal ch4Total = BigDecimal.ZERO;
        BigDecimal n2oTotal = BigDecimal.ZERO;
        BigDecimal totalDirectEmissions;
        BigDecimal total;


        if (port.getDirectEmissions() != null) {
            co2Total = co2Total.add(port.getDirectEmissions().getCo2());
            ch4Total = ch4Total.add(port.getDirectEmissions().getCh4());
            n2oTotal = n2oTotal.add(port.getDirectEmissions().getN2o());
            totalDirectEmissions = co2Total.add(ch4Total).add(n2oTotal);
            totalDirectEmissions = totalDirectEmissions.setScale(7, RoundingMode.HALF_UP);
            port.getDirectEmissions().setTotal(totalDirectEmissions);
        }

        for (AerFuelConsumption fuelConsumption : port.getFuelConsumptions()) {
            Triple<BigDecimal, BigDecimal, BigDecimal> totals = calculateEmissionTotals(shipEmissions, fuelConsumption);

            co2Total = co2Total.add(totals.getLeft());
            ch4Total = ch4Total.add(totals.getMiddle());
            n2oTotal = n2oTotal.add(totals.getRight());

            co2Total = co2Total.setScale(7, RoundingMode.HALF_UP);
            ch4Total = ch4Total.setScale(7, RoundingMode.HALF_UP);
            n2oTotal = n2oTotal.setScale(7, RoundingMode.HALF_UP);
        }

        total = sumAndScale(co2Total, ch4Total, n2oTotal);

        AerPortEmissionsMeasurement totalEmissions = AerPortEmissionsMeasurement.builder()
            .co2(co2Total)
            .ch4(ch4Total)
            .n2o(n2oTotal)
            .total(total)
            .build();

        port.setTotalEmissions(totalEmissions);
        port.setSurrenderEmissions(totalEmissions);
    }
}
