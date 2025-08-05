package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;

import java.math.BigDecimal;
import java.math.RoundingMode;


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

        //Less captured Co2
        BigDecimal lessCapturedCo2 = BigDecimal.ZERO;
        BigDecimal lessCapturedCh4 = BigDecimal.ZERO;
        BigDecimal lessCapturedN2o = BigDecimal.ZERO;
        BigDecimal totalLessCaptured = BigDecimal.ZERO;

        //Less voyages not in scope
        BigDecimal lessVoyagesNotInScopeCo2 = BigDecimal.ZERO;
        BigDecimal lessVoyagesNotInScopeCh4 = BigDecimal.ZERO;
        BigDecimal lessVoyagesNotInScopeN2o = BigDecimal.ZERO;
        BigDecimal totalLessVoyagesNotInScope = BigDecimal.ZERO;

        //Less small island ferry deduction
        BigDecimal lessIslandFerryDeductionCo2 = BigDecimal.ZERO;
        BigDecimal lessIslandFerryDeductionCh4 = BigDecimal.ZERO;
        BigDecimal lessIslandFerryDeductionN2o = BigDecimal.ZERO;

        //Less 5 percent ice class deduction
        BigDecimal less5PercentIceClassDeductionCo2 = BigDecimal.ZERO;
        BigDecimal less5PercentIceClassDeductionCh4 = BigDecimal.ZERO;
        BigDecimal less5PercentIceClassDeductionN2o = BigDecimal.ZERO;

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

            if (shipAggregatedData.getLessCapturedCo2() != null) {
                lessCapturedCo2 = lessCapturedCo2.add(shipAggregatedData.getLessCapturedCo2().getCo2());
                lessCapturedCh4 = lessCapturedCh4.add(shipAggregatedData.getLessCapturedCo2().getCh4());
                lessCapturedN2o = lessCapturedN2o.add(shipAggregatedData.getLessCapturedCo2().getN2o());
                totalLessCaptured = totalLessCaptured.add(shipAggregatedData.getLessCapturedCo2().getTotal());
            }

            lessCapturedCo2 = lessCapturedCo2.setScale(7, RoundingMode.HALF_UP);
            lessCapturedCh4 = lessCapturedCh4.setScale(7, RoundingMode.HALF_UP);
            lessCapturedN2o = lessCapturedN2o.setScale(7, RoundingMode.HALF_UP);
            totalLessCaptured = totalLessCaptured.setScale(7, RoundingMode.HALF_UP);

            if (shipAggregatedData.getLessVoyagesNotInScope() != null) {
                lessVoyagesNotInScopeCo2 = lessVoyagesNotInScopeCo2.add(shipAggregatedData.getLessVoyagesNotInScope().getCo2());
                lessVoyagesNotInScopeCh4 = lessVoyagesNotInScopeCh4.add(shipAggregatedData.getLessVoyagesNotInScope().getCh4());
                lessVoyagesNotInScopeN2o = lessVoyagesNotInScopeN2o.add(shipAggregatedData.getLessVoyagesNotInScope().getN2o());
                totalLessVoyagesNotInScope = totalLessVoyagesNotInScope.add(shipAggregatedData.getLessVoyagesNotInScope().getTotal());
            }

            lessVoyagesNotInScopeCo2 = lessVoyagesNotInScopeCo2.setScale(7, RoundingMode.HALF_UP);
            lessVoyagesNotInScopeCh4 = lessVoyagesNotInScopeCh4.setScale(7, RoundingMode.HALF_UP);
            lessVoyagesNotInScopeN2o = lessVoyagesNotInScopeN2o.setScale(7, RoundingMode.HALF_UP);
            totalLessVoyagesNotInScope = totalLessVoyagesNotInScope.setScale(7, RoundingMode.HALF_UP);

            if (shipAggregatedData.getLessIslandFerryDeduction() != null) {
                lessIslandFerryDeductionCo2 = lessIslandFerryDeductionCo2.add(shipAggregatedData.getLessIslandFerryDeduction().getCo2());
                lessIslandFerryDeductionCh4 = lessIslandFerryDeductionCh4.add(shipAggregatedData.getLessIslandFerryDeduction().getCh4());
                lessIslandFerryDeductionN2o = lessIslandFerryDeductionN2o.add(shipAggregatedData.getLessIslandFerryDeduction().getN2o());

            }

            lessIslandFerryDeductionCo2 = lessIslandFerryDeductionCo2.setScale(7, RoundingMode.HALF_UP);
            lessIslandFerryDeductionCh4 = lessIslandFerryDeductionCh4.setScale(7, RoundingMode.HALF_UP);
            lessIslandFerryDeductionN2o = lessIslandFerryDeductionN2o.setScale(7, RoundingMode.HALF_UP);

            if (shipAggregatedData.getLess5PercentIceClassDeduction() != null) {
                less5PercentIceClassDeductionCo2 = less5PercentIceClassDeductionCo2.add(shipAggregatedData.getLess5PercentIceClassDeduction().getCo2());
                less5PercentIceClassDeductionCh4 = less5PercentIceClassDeductionCh4.add(shipAggregatedData.getLess5PercentIceClassDeduction().getCh4());
                less5PercentIceClassDeductionN2o = less5PercentIceClassDeductionN2o.add(shipAggregatedData.getLess5PercentIceClassDeduction().getN2o());
            }

            less5PercentIceClassDeductionCo2 = less5PercentIceClassDeductionCo2.setScale(7, RoundingMode.HALF_UP);
            less5PercentIceClassDeductionCh4 = less5PercentIceClassDeductionCh4.setScale(7, RoundingMode.HALF_UP);
            less5PercentIceClassDeductionN2o = less5PercentIceClassDeductionN2o.setScale(7, RoundingMode.HALF_UP);
        }

        //Less ERC
        BigDecimal lessERCCo2 = lessVoyagesNotInScopeCo2;
        BigDecimal lessERCCh4 = lessVoyagesNotInScopeCh4;
        BigDecimal lessERCN2o = lessVoyagesNotInScopeN2o;

        if (aer.getSmf().getSmfDetails() != null) {
            lessERCCo2 = lessERCCo2.subtract(aer.getSmf().getSmfDetails().getTotalSustainableEmissions());
            lessERCCo2 = lessERCCo2.setScale(7, RoundingMode.HALF_UP);
            lessIslandFerryDeductionCo2 = lessIslandFerryDeductionCo2.subtract(aer.getSmf().getSmfDetails().getTotalSustainableEmissions());
            lessIslandFerryDeductionCo2 = lessIslandFerryDeductionCo2.setScale(7, RoundingMode.HALF_UP);

            less5PercentIceClassDeductionCo2 = less5PercentIceClassDeductionCo2.subtract(aer.getSmf().getSmfDetails().getTotalSustainableEmissions());
            less5PercentIceClassDeductionCo2 = less5PercentIceClassDeductionCo2.setScale(7, RoundingMode.HALF_UP);
        }

        BigDecimal totalLessERC = lessERCCo2.add(lessERCCh4).add(lessERCN2o);
        totalLessERC = totalLessERC.setScale(7, RoundingMode.HALF_UP);

        BigDecimal totalLessIslandFerryDeduction = lessIslandFerryDeductionCo2.add(lessIslandFerryDeductionCh4).add(lessIslandFerryDeductionN2o);
        totalLessIslandFerryDeduction = totalLessIslandFerryDeduction.setScale(7, RoundingMode.HALF_UP);

        BigDecimal totalLess5PercentIceClassDeduction = less5PercentIceClassDeductionCo2.add(less5PercentIceClassDeductionCh4).add(less5PercentIceClassDeductionN2o);
        totalLess5PercentIceClassDeduction = totalLess5PercentIceClassDeduction.setScale(7, RoundingMode.HALF_UP);


        BigDecimal totalShipEmissionsSummary = totalLessERC.setScale(0, RoundingMode.HALF_UP);
        BigDecimal surrenderEmissionsSummary = totalLess5PercentIceClassDeduction.setScale(0, RoundingMode.HALF_UP);

        aer.setTotalEmissions(AerTotalEmissions.builder()
                .totalEmissions(buildAerPortEmissionsMeasurement(totalEmissionsCo2, totalEmissionsCh4, totalEmissionsN2o, sumTotalEmissions))
                .lessCapturedCo2(buildAerPortEmissionsMeasurement(lessCapturedCo2, lessCapturedCh4, lessCapturedN2o, totalLessCaptured))
                .lessVoyagesNotInScope(buildAerPortEmissionsMeasurement(lessVoyagesNotInScopeCo2, lessVoyagesNotInScopeCh4, lessVoyagesNotInScopeN2o, totalLessVoyagesNotInScope))
                .lessAnyERC(buildAerPortEmissionsMeasurement(lessERCCo2, lessERCCh4, lessERCN2o, totalLessERC))
                .lessIslandFerryDeduction(buildAerPortEmissionsMeasurement(lessIslandFerryDeductionCo2, lessIslandFerryDeductionCh4, lessIslandFerryDeductionN2o, totalLessIslandFerryDeduction))
                .less5PercentIceClassDeduction(buildAerPortEmissionsMeasurement(less5PercentIceClassDeductionCo2, less5PercentIceClassDeductionCh4, less5PercentIceClassDeductionN2o, totalLess5PercentIceClassDeduction))
                .totalShipEmissions(totalLessERC)
                .surrenderEmissions(totalLess5PercentIceClassDeduction)
                .totalShipEmissionsSummary(totalShipEmissionsSummary)
                .surrenderEmissionsSummary(surrenderEmissionsSummary)
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
}
