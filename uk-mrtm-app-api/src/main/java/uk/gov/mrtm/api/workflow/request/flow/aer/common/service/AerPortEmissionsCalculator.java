package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.NINETY_FIVE_PERCENT;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.filterFuelAndEmissionsFactors;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.sumAndScale;

@Service
@RequiredArgsConstructor
public class AerPortEmissionsCalculator {
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");

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
        BigDecimal totalDirectEmissions = BigDecimal.ZERO;
        BigDecimal total;

        BigDecimal co2Surrender = BigDecimal.ZERO;
        BigDecimal ch4Surrender = BigDecimal.ZERO;
        BigDecimal n2oSurrender = BigDecimal.ZERO;
        BigDecimal totalSurrender;

        if (port.getDirectEmissions() != null) {
            co2Total = co2Total.add(port.getDirectEmissions().getCo2());
            ch4Total = ch4Total.add(port.getDirectEmissions().getCh4());
            n2oTotal = n2oTotal.add(port.getDirectEmissions().getN2o());
            totalDirectEmissions = co2Total.add(ch4Total).add(n2oTotal);
            totalDirectEmissions = totalDirectEmissions.setScale(7, RoundingMode.HALF_UP);
            port.getDirectEmissions().setTotal(totalDirectEmissions);
        }

        for (AerFuelConsumption fuelConsumption : port.getFuelConsumptions()) {
            Triple<BigDecimal, BigDecimal, BigDecimal> totals = calculateEmissionTotals(shipEmissions, fuelConsumption, co2Total, ch4Total, n2oTotal);
            co2Total = totals.getLeft();
            ch4Total = totals.getMiddle();
            n2oTotal = totals.getRight();
            total = sumAndScale(co2Total, ch4Total, n2oTotal);

            if (port.getPortDetails() != null
                    && BooleanUtils.isNotTrue(port.getPortDetails().getSmallIslandFerryReduction())) {

                Triple<BigDecimal, BigDecimal, BigDecimal> surrenderEmissions =
                        calculateSurrenderEmissions(shipEmissions, port,
                                co2Total, ch4Total, n2oTotal);

                co2Surrender = surrenderEmissions.getLeft();
                ch4Surrender = surrenderEmissions.getMiddle();
                n2oSurrender = surrenderEmissions.getRight();
            }

            co2Surrender = co2Surrender.setScale(7, RoundingMode.HALF_UP);
            ch4Surrender = ch4Surrender.setScale(7, RoundingMode.HALF_UP);
            n2oSurrender = n2oSurrender.setScale(7, RoundingMode.HALF_UP);

            totalSurrender = sumAndScale(co2Surrender, ch4Surrender, n2oSurrender);

            if (port.getDirectEmissions() != null) {
                port.getDirectEmissions().setTotal(totalDirectEmissions);
            }

            port.setTotalEmissions(
                    AerPortEmissionsMeasurement.builder()
                            .co2(co2Total)
                            .ch4(ch4Total)
                            .n2o(n2oTotal)
                            .total(total)
                            .build()
            );
            port.setSurrenderEmissions(
                    AerPortEmissionsMeasurement.builder()
                            .co2(co2Surrender)
                            .ch4(ch4Surrender)
                            .n2o(n2oSurrender)
                            .total(totalSurrender)
                            .build()
            );
        }
    }

    private Triple<BigDecimal, BigDecimal, BigDecimal> calculateEmissionTotals(AerShipEmissions shipEmissions,
                                                                               AerFuelConsumption fuelConsumption,
                                                                               BigDecimal co2Total, BigDecimal ch4Total,
                                                                               BigDecimal n2oTotal) {
        BigDecimal totalFuelConsumption;

        Optional<AerFuelsAndEmissionsFactors> fuelsAndEmissionsFactorsOptional = shipEmissions.getFuelsAndEmissionsFactors()
                .stream()
                .filter(emissions -> filterFuelAndEmissionsFactors(emissions, fuelConsumption.getFuelOriginTypeName()))
                .findFirst();

        totalFuelConsumption = AerEmissionsCalculatorUtils.getTotalFuelConsumption(fuelConsumption);
        fuelConsumption.setTotalConsumption(totalFuelConsumption);

        if (fuelsAndEmissionsFactorsOptional.isPresent()){
            AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors = fuelsAndEmissionsFactorsOptional.get();

            BigDecimal methaneSlip = AerEmissionsCalculatorUtils
                    .getOrDefaultBigDecimal(fuelConsumption.getFuelOriginTypeName().getMethaneSlip());
            BigDecimal methaneSlipFraction = methaneSlip.divide(ONE_HUNDRED);
            BigDecimal methaneUtilization = BigDecimal.ONE.subtract(methaneSlipFraction);

            BigDecimal co2 = AerEmissionsCalculatorUtils.calculateCo2(totalFuelConsumption, methaneUtilization, fuelsAndEmissionsFactors);
            BigDecimal n2o = AerEmissionsCalculatorUtils.calculateN2o(totalFuelConsumption, methaneUtilization, fuelsAndEmissionsFactors);
            BigDecimal ch4 = AerEmissionsCalculatorUtils.calculateCh4(totalFuelConsumption, methaneUtilization, fuelsAndEmissionsFactors, methaneSlipFraction);

            co2Total = co2Total.add(co2);
            ch4Total = ch4Total.add(ch4);
            n2oTotal = n2oTotal.add(n2o);

            co2Total = co2Total.setScale(7, RoundingMode.HALF_UP);
            ch4Total = ch4Total.setScale(7, RoundingMode.HALF_UP);
            n2oTotal = n2oTotal.setScale(7, RoundingMode.HALF_UP);
        }
        return Triple.of(co2Total, ch4Total, n2oTotal);
    }

    private Triple<BigDecimal, BigDecimal, BigDecimal> calculateSurrenderEmissions(AerShipEmissions shipEmissions,
                                                                                   AerPort port,
                                                                                   BigDecimal co2Total, BigDecimal ch4Total,
                                                                                   BigDecimal n2oTotal) {
        BigDecimal ccsAndCcu = port.getPortDetails().getCcsAndCcu();

        BigDecimal co2Surrender = co2Total.subtract(ccsAndCcu);
        BigDecimal ch4Surrender = ch4Total;
        BigDecimal n2oSurrender = n2oTotal;

        co2Surrender = co2Surrender.setScale(7, RoundingMode.HALF_UP);

        if (Boolean.TRUE.equals(shipEmissions.getDetails().getHasIceClassDerogation())) {
            co2Surrender = co2Surrender.multiply(NINETY_FIVE_PERCENT);
            ch4Surrender = ch4Surrender.multiply(NINETY_FIVE_PERCENT);
            n2oSurrender = n2oSurrender.multiply(NINETY_FIVE_PERCENT);
        }

        return Triple.of(co2Surrender, ch4Surrender, n2oSurrender);
    }

}
