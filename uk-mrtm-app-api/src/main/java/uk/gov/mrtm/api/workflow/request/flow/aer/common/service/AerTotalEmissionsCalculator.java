package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.FIFTY_PERCENT;


@Service
@RequiredArgsConstructor
public class AerTotalEmissionsCalculator {

    public void calculateEmissions(Aer aer) {

        if (aer == null || aer.getAggregatedData() == null || aer.getSmf() == null) {
            return;
        }

        //Total emissions
        BigDecimal totalEmissionsCo2 = BigDecimal.ZERO;
        BigDecimal totalEmissionsCh4 = BigDecimal.ZERO;
        BigDecimal totalEmissionsN2o = BigDecimal.ZERO;
        BigDecimal sumTotalEmissions = BigDecimal.ZERO;

        //Less voyages in Northern Ireland deduction
        BigDecimal lessVoyagesInNorthernIrelandDeductionCo2 = BigDecimal.ZERO;
        BigDecimal lessVoyagesInNorthernIrelandDeductionCh4 = BigDecimal.ZERO;
        BigDecimal lessVoyagesInNorthernIrelandDeductionN2o = BigDecimal.ZERO;

        for (AerShipAggregatedData shipAggregatedData : aer.getAggregatedData().getEmissions()) {

            if (shipAggregatedData.getTotalEmissionsFromVoyagesAndPorts() != null) {
                totalEmissionsCo2 = totalEmissionsCo2.add(shipAggregatedData.getTotalEmissionsFromVoyagesAndPorts().getCo2());
                totalEmissionsCh4 = totalEmissionsCh4.add(shipAggregatedData.getTotalEmissionsFromVoyagesAndPorts().getCh4());
                totalEmissionsN2o = totalEmissionsN2o.add(shipAggregatedData.getTotalEmissionsFromVoyagesAndPorts().getN2o());
                sumTotalEmissions = sumTotalEmissions.add(shipAggregatedData.getTotalEmissionsFromVoyagesAndPorts().getTotal());
            }

            totalEmissionsCo2 = totalEmissionsCo2.setScale(7, RoundingMode.HALF_UP);
            totalEmissionsCh4 = totalEmissionsCh4.setScale(7, RoundingMode.HALF_UP);
            totalEmissionsN2o = totalEmissionsN2o.setScale(7, RoundingMode.HALF_UP);
            sumTotalEmissions = sumTotalEmissions.setScale(7, RoundingMode.HALF_UP);

            if (shipAggregatedData.getEmissionsBetweenUKAndNIVoyages() != null) {
                lessVoyagesInNorthernIrelandDeductionCo2 = lessVoyagesInNorthernIrelandDeductionCo2.add(shipAggregatedData.getEmissionsBetweenUKAndNIVoyages().getCo2());
                lessVoyagesInNorthernIrelandDeductionCh4 = lessVoyagesInNorthernIrelandDeductionCh4.add(shipAggregatedData.getEmissionsBetweenUKAndNIVoyages().getCh4());
                lessVoyagesInNorthernIrelandDeductionN2o = lessVoyagesInNorthernIrelandDeductionN2o.add(shipAggregatedData.getEmissionsBetweenUKAndNIVoyages().getN2o());
            }

            lessVoyagesInNorthernIrelandDeductionCo2 = lessVoyagesInNorthernIrelandDeductionCo2.setScale(7, RoundingMode.HALF_UP);
            lessVoyagesInNorthernIrelandDeductionCh4 = lessVoyagesInNorthernIrelandDeductionCh4.setScale(7, RoundingMode.HALF_UP);
            lessVoyagesInNorthernIrelandDeductionN2o = lessVoyagesInNorthernIrelandDeductionN2o.setScale(7, RoundingMode.HALF_UP);
        }

        BigDecimal erc = aer.getSmf().getSmfDetails() != null ? aer.getSmf().getSmfDetails().getTotalSustainableEmissions(): BigDecimal.ZERO;

        //Less Emissions Reduction Claim
        BigDecimal lessEmissionsReductionClaimCh4 = totalEmissionsCh4;
        BigDecimal lessEmissionsReductionClaimN2o = totalEmissionsN2o;
        BigDecimal lessEmissionsReductionClaimCo2 = totalEmissionsCo2;
        lessEmissionsReductionClaimCo2 = lessEmissionsReductionClaimCo2.subtract(erc);
        lessEmissionsReductionClaimCo2 = lessEmissionsReductionClaimCo2.setScale(7, RoundingMode.HALF_UP);
        BigDecimal totalLessEmissionsReductionClaim = lessEmissionsReductionClaimCo2
            .add(lessEmissionsReductionClaimCh4)
            .add(lessEmissionsReductionClaimN2o);
        totalLessEmissionsReductionClaim = totalLessEmissionsReductionClaim.setScale(7, RoundingMode.HALF_UP);

        //Less Northern Ireland voyages deduction
        lessVoyagesInNorthernIrelandDeductionCo2 = calculateLessVoyagesInNorthernIrelandDeductionCo2(
            lessVoyagesInNorthernIrelandDeductionCo2, totalEmissionsCo2, erc, lessEmissionsReductionClaimCo2);
        lessVoyagesInNorthernIrelandDeductionCh4 = calculateLessVoyagesInNorthernIrelandDeduction(
            lessVoyagesInNorthernIrelandDeductionCh4, lessEmissionsReductionClaimCh4);
        lessVoyagesInNorthernIrelandDeductionN2o = calculateLessVoyagesInNorthernIrelandDeduction(
            lessVoyagesInNorthernIrelandDeductionN2o, lessEmissionsReductionClaimN2o);

        BigDecimal totalVoyagesInNorthernIrelandDeduction = lessVoyagesInNorthernIrelandDeductionCo2
            .add(lessVoyagesInNorthernIrelandDeductionCh4)
            .add(lessVoyagesInNorthernIrelandDeductionN2o);
        totalVoyagesInNorthernIrelandDeduction = totalVoyagesInNorthernIrelandDeduction.setScale(7, RoundingMode.HALF_UP);

        BigDecimal totalShipEmissionsSummary = totalLessEmissionsReductionClaim.setScale(0, RoundingMode.HALF_UP);
        BigDecimal surrenderEmissionsSummary = totalVoyagesInNorthernIrelandDeduction.setScale(0, RoundingMode.HALF_UP);

        aer.setTotalEmissions(AerTotalEmissions.builder()
            .totalEmissions(buildAerPortEmissionsMeasurement(totalEmissionsCo2, totalEmissionsCh4, totalEmissionsN2o, sumTotalEmissions))
            .lessVoyagesInNorthernIrelandDeduction(buildAerPortEmissionsMeasurement(lessVoyagesInNorthernIrelandDeductionCo2, lessVoyagesInNorthernIrelandDeductionCh4, lessVoyagesInNorthernIrelandDeductionN2o, totalVoyagesInNorthernIrelandDeduction))
            .lessEmissionsReductionClaim(buildAerPortEmissionsMeasurement(lessEmissionsReductionClaimCo2, lessEmissionsReductionClaimCh4, lessEmissionsReductionClaimN2o, totalLessEmissionsReductionClaim))
            .totalShipEmissionsSummary(totalShipEmissionsSummary)
            .surrenderEmissionsSummary(surrenderEmissionsSummary)
            .totalShipEmissions(totalLessEmissionsReductionClaim)
            .surrenderEmissions(totalVoyagesInNorthernIrelandDeduction)
            .build());
    }

    private AerPortEmissionsMeasurement buildAerPortEmissionsMeasurement(BigDecimal co2, BigDecimal ch4, BigDecimal n2o, BigDecimal total) {
        return AerPortEmissionsMeasurement.builder()
                .co2(co2)
                .ch4(ch4)
                .n2o(n2o)
                .total(total)
                .build();
    }

    private BigDecimal calculateLessVoyagesInNorthernIrelandDeductionCo2(BigDecimal niEmission, BigDecimal totalEmission,
                                                                         BigDecimal erc, BigDecimal lessErc) {
        if (totalEmission.compareTo(BigDecimal.ZERO) != 0) {
            BigDecimal emissionRatio = niEmission.divide(totalEmission, RoundingMode.HALF_UP);
            BigDecimal reductableEmissions = emissionRatio.multiply(erc);
            BigDecimal reductedEmissions = niEmission.subtract(reductableEmissions);
            BigDecimal halfReductedEmissions = reductedEmissions.multiply(FIFTY_PERCENT);
            BigDecimal finalEmissions = lessErc.subtract(halfReductedEmissions);
            finalEmissions = finalEmissions.setScale(7, RoundingMode.HALF_UP);
            return finalEmissions;
        } else {
            return lessErc;
        }

    }

    private BigDecimal calculateLessVoyagesInNorthernIrelandDeduction(BigDecimal niEmission, BigDecimal lessErc) {
        BigDecimal halfNiEmission = niEmission.multiply(FIFTY_PERCENT);
        BigDecimal finalEmissions = lessErc.subtract(halfNiEmission);
        finalEmissions = finalEmissions.setScale(7, RoundingMode.HALF_UP);
        return finalEmissions;
    }
}
