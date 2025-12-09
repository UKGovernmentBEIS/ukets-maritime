package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.tuple.Triple;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.enumeration.MeasuringUnit;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import java.util.Set;

import static uk.gov.mrtm.api.reporting.validation.AerValidatorHelper.getUniqueFuelName;

@UtilityClass
public class AerEmissionsCalculatorUtils {
    private static final BigDecimal GWP_CO2 = new BigDecimal("1");
    private static final BigDecimal GWP_CH4 = new BigDecimal("28");
    private static final BigDecimal GWP_N2O = new BigDecimal("265");
    public static final BigDecimal FIFTY_PERCENT = new BigDecimal("0.5");
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");

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
        return getUniqueFuelName(emissions.getName(), emissions.getTypeAsString())
            .equals(getUniqueFuelName(fuelOriginTypeName.getName(), fuelOriginTypeName.getTypeAsString()));
    }

    public static Optional<AerShipEmissions> findShipEmissions(Set<AerShipEmissions> aerEmissions, String imoNumber) {
        return aerEmissions
            .stream()
            .filter(aerShipEmissions -> aerShipEmissions.getDetails().getImoNumber().equals(imoNumber))
            .findFirst();
    }

    public static BigDecimal sumAndScale(BigDecimal... values) {
        BigDecimal sum = BigDecimal.ZERO;
        for (BigDecimal value : values) {
                sum = sum.add(value);
        }
        return sum.setScale(7, RoundingMode.HALF_UP);
    }

    public static Triple<BigDecimal, BigDecimal, BigDecimal> calculateEmissionTotals(AerShipEmissions shipEmissions,
                                                                              AerFuelConsumption fuelConsumption) {
        BigDecimal totalFuelConsumption;
        BigDecimal co2 = BigDecimal.ZERO;
        BigDecimal n2o = BigDecimal.ZERO;
        BigDecimal ch4 = BigDecimal.ZERO;

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

            co2 = AerEmissionsCalculatorUtils.calculateCo2(totalFuelConsumption, methaneUtilization, fuelsAndEmissionsFactors);
            n2o = AerEmissionsCalculatorUtils.calculateN2o(totalFuelConsumption, methaneUtilization, fuelsAndEmissionsFactors);
            ch4 = AerEmissionsCalculatorUtils.calculateCh4(totalFuelConsumption, methaneUtilization, fuelsAndEmissionsFactors, methaneSlipFraction);
        }

        return Triple.of(co2, ch4, n2o);
    }
}
