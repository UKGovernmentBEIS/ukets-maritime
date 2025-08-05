package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.experimental.UtilityClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.enumeration.MeasuringUnit;
import uk.gov.mrtm.api.reporting.validation.AerValidatorHelper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import java.util.Set;

@UtilityClass
public class AerEmissionsCalculatorUtils {
    private static final BigDecimal GWP_CO2 = new BigDecimal("1");
    private static final BigDecimal GWP_CH4 = new BigDecimal("29.8");
    private static final BigDecimal GWP_N2O = new BigDecimal("273");
    public static final BigDecimal NINETY_FIVE_PERCENT = new BigDecimal("0.95");
    public static final BigDecimal FIFTY_PERCENT = new BigDecimal("0.5");

    public static BigDecimal calculateCh4(BigDecimal totalFuelConsumption,
                                    BigDecimal methaneUtilization,
                                    AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors,
                                    BigDecimal methaneSlipFraction) {
        BigDecimal methaneSlipUtilization = totalFuelConsumption
            .multiply(methaneUtilization)
            .multiply(fuelsAndEmissionsFactors.getMethane());

        BigDecimal methaneSlipAmount = totalFuelConsumption.multiply(methaneSlipFraction);
        BigDecimal totalMethaneSlip = methaneSlipUtilization.add(methaneSlipAmount);
        return totalMethaneSlip.multiply(GWP_CH4);
    }

    public static BigDecimal calculateN2o(BigDecimal totalFuelConsumption,
                                    BigDecimal methaneUtilization,
                                    AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors) {
        return totalFuelConsumption
            .multiply(methaneUtilization)
            .multiply(fuelsAndEmissionsFactors.getNitrousOxide())
            .multiply(GWP_N2O);
    }

    public static BigDecimal calculateCo2(BigDecimal totalFuelConsumption,
                                    BigDecimal methaneUtilization,
                                    AerFuelsAndEmissionsFactors fuelsAndEmissionsFactors) {
        return totalFuelConsumption
            .multiply(methaneUtilization)
            .multiply(fuelsAndEmissionsFactors.getCarbonDioxide())
            .multiply(GWP_CO2);
    }

    public static BigDecimal getOrDefaultBigDecimal(BigDecimal value) {
        return value != null
            ? value
            : BigDecimal.ZERO;
    }

    public static BigDecimal applyEmissionReduction(BigDecimal value, BigDecimal reductionPercentage) {
        BigDecimal reduction = value.multiply(reductionPercentage);
        value = value.subtract(reduction);
        return value;
    }

    public static BigDecimal getTotalFuelConsumption(AerFuelConsumption fuelConsumption) {
        BigDecimal totalFuelConsumption;

        if (MeasuringUnit.M3.equals(fuelConsumption.getMeasuringUnit())){
            totalFuelConsumption = fuelConsumption.getAmount().multiply(fuelConsumption.getFuelDensity());
        } else {
            totalFuelConsumption = fuelConsumption.getAmount();
        }

        totalFuelConsumption = totalFuelConsumption.setScale(5, RoundingMode.HALF_UP);

        return totalFuelConsumption;
    }

    public static boolean filterFuelAndEmissionsFactors(AerFuelsAndEmissionsFactors emissions, FuelOriginTypeName fuelOriginTypeName) {
        return AerValidatorHelper.buildFuelOriginTypeName(emissions).equals(AerValidatorHelper.buildFuelOriginTypeName(fuelOriginTypeName));
    }

    public static Optional<AerShipEmissions> findShipEmissions(Set<AerShipEmissions> aerEmissions, String imoNumber) {
        return aerEmissions
            .stream()
            .filter(aerShipEmissions -> aerShipEmissions.getDetails().getImoNumber().equals(imoNumber))
            .findFirst();
    }

}
