package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.enumeration.PortType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerPortCodesUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.FIFTY_PERCENT;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.calculateEmissionTotals;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.sumAndScale;

@Service
@RequiredArgsConstructor
public class AerVoyageEmissionsCalculator {

    public void calculateEmissions(Aer aer) {
        if (aer == null || aer.getEmissions() == null || aer.getVoyageEmissions() == null) {
            return;
        }

        for (AerVoyage voyage : aer.getVoyageEmissions().getVoyages()) {
            Optional<AerShipEmissions> shipEmissionsOptional =
                    AerEmissionsCalculatorUtils.findShipEmissions(aer.getEmissions().getShips(), voyage.getImoNumber());

            if (shipEmissionsOptional.isPresent()) {
                processVoyageEmissions(voyage, shipEmissionsOptional.get());
            }
        }
    }

    private void processVoyageEmissions(AerVoyage voyage, AerShipEmissions shipEmissions) {
        BigDecimal co2Total = BigDecimal.ZERO;
        BigDecimal ch4Total = BigDecimal.ZERO;
        BigDecimal n2oTotal = BigDecimal.ZERO;
        BigDecimal total;

        if (voyage.getDirectEmissions() != null) {
            co2Total = co2Total.add(voyage.getDirectEmissions().getCo2());
            ch4Total = ch4Total.add(voyage.getDirectEmissions().getCh4());
            n2oTotal = n2oTotal.add(voyage.getDirectEmissions().getN2o());
            BigDecimal  totalDirectEmissions = co2Total.add(ch4Total).add(n2oTotal);
            totalDirectEmissions = totalDirectEmissions.setScale(7, RoundingMode.HALF_UP);
            voyage.getDirectEmissions().setTotal(totalDirectEmissions);
        }

        for (AerFuelConsumption fuelConsumption : voyage.getFuelConsumptions()) {

            Triple<BigDecimal, BigDecimal, BigDecimal> totals = calculateEmissionTotals(shipEmissions, fuelConsumption);

            co2Total = co2Total.add(totals.getLeft());
            ch4Total = ch4Total.add(totals.getMiddle());
            n2oTotal = n2oTotal.add(totals.getRight());

            co2Total = co2Total.setScale(7, RoundingMode.HALF_UP);
            ch4Total = ch4Total.setScale(7, RoundingMode.HALF_UP);
            n2oTotal = n2oTotal.setScale(7, RoundingMode.HALF_UP);
        }

        total = sumAndScale(co2Total, ch4Total, n2oTotal);

        BigDecimal co2Surrender = BigDecimal.ZERO;
        BigDecimal ch4Surrender = BigDecimal.ZERO;
        BigDecimal n2oSurrender = BigDecimal.ZERO;
        BigDecimal totalSurrender;

        PortType journeyType = voyage.getVoyageDetails() != null ? AerPortCodesUtils.getJourneyType(
                voyage.getVoyageDetails().getDeparturePort(),
                voyage.getVoyageDetails().getArrivalPort()) : null;

        if (PortType.GB.equals(journeyType)) {
            co2Surrender = co2Total;
            ch4Surrender = ch4Total;
            n2oSurrender = n2oTotal;
        }

        if (PortType.NI.equals(journeyType)) {
            co2Surrender = AerEmissionsCalculatorUtils.applyEmissionReduction(co2Total, FIFTY_PERCENT);
            ch4Surrender = AerEmissionsCalculatorUtils.applyEmissionReduction(ch4Total, FIFTY_PERCENT);
            n2oSurrender = AerEmissionsCalculatorUtils.applyEmissionReduction(n2oTotal, FIFTY_PERCENT);
        }

        co2Surrender = co2Surrender.setScale(7, RoundingMode.HALF_UP);
        ch4Surrender = ch4Surrender.setScale(7, RoundingMode.HALF_UP);
        n2oSurrender = n2oSurrender.setScale(7, RoundingMode.HALF_UP);
        totalSurrender = sumAndScale(co2Surrender, ch4Surrender, n2oSurrender);

        voyage.setTotalEmissions(
                AerPortEmissionsMeasurement.builder()
                        .co2(co2Total)
                        .ch4(ch4Total)
                        .n2o(n2oTotal)
                        .total(total)
                        .build()
        );
        voyage.setSurrenderEmissions(
                AerPortEmissionsMeasurement.builder()
                        .co2(co2Surrender)
                        .ch4(ch4Surrender)
                        .n2o(n2oSurrender)
                        .total(totalSurrender)
                        .build()
        );
    }

}
