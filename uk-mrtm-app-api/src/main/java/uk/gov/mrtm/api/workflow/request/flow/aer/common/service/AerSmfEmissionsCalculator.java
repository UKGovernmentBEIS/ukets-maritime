package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class AerSmfEmissionsCalculator {

    public void calculateEmissions(Aer aer) {
        if (aer == null || aer.getSmf() == null) {
            return;
        }

        calculateEmissions(aer.getSmf());
    }

    public void calculateEmissions(AerSmf smf) {
        if (smf.getSmfDetails() == null) {
            return;
        }

        BigDecimal totalCo2Emissions = BigDecimal.ZERO;

        for (AerSmfPurchase purchase : smf.getSmfDetails().getPurchases()) {
            BigDecimal co2Emissions = purchase.getCo2EmissionFactor().multiply(purchase.getSmfMass());
            purchase.setCo2Emissions(co2Emissions.setScale(7, RoundingMode.HALF_UP));

            totalCo2Emissions = totalCo2Emissions.add(co2Emissions).setScale(7, RoundingMode.HALF_UP);
        }

        smf.getSmfDetails().setTotalSustainableEmissions(totalCo2Emissions);
    }
}
