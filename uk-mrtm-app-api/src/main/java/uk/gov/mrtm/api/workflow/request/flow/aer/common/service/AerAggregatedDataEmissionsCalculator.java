package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortDetails;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyage;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.reporting.enumeration.PortType;
import uk.gov.mrtm.api.reporting.validation.AerValidatorHelper;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerPortCodesUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.FIFTY_PERCENT;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.NINETY_FIVE_PERCENT;

@Service
@RequiredArgsConstructor
public class AerAggregatedDataEmissionsCalculator {

    public void calculateEmissions(Aer aer) {
        if (aer == null || aer.getEmissions() == null || aer.getAggregatedData() == null) {
            return;
        }

        for (AerShipAggregatedData emissions : aer.getAggregatedData().getEmissions()) {

            Optional<AerShipEmissions> shipEmissionsOptional = aer.getEmissions().getShips()
                .stream()
                .filter(aerShipEmissions -> aerShipEmissions.getDetails().getImoNumber().equals(emissions.getImoNumber()))
                .findFirst();

            if (shipEmissionsOptional.isPresent()) {
                AerShipEmissions shipEmissions = shipEmissionsOptional.get();

                boolean smallIslandFerryOperatorReduction = shipEmissions.getDerogations() != null
                    && Boolean.TRUE.equals(shipEmissions.getDerogations().getSmallIslandFerryOperatorReduction());

                AerAggregatedEmissionsMeasurement emissionsWithinUKPorts = getOrCalculateEmissionsWithinUKPorts(
                    aer.getPortEmissions(), emissions);

                AerAggregatedEmissionsMeasurement emissionsBetweenUKPorts = getOrCalculateEmissionsBetweenUKPorts(
                    aer.getVoyageEmissions(), emissions);

                AerAggregatedEmissionsMeasurement emissionsBetweenUKAndEEAVoyages = getOrCalculateEmissionsBetweenUKAndEEAVoyages(
                    aer.getVoyageEmissions(), emissions);

                AerAggregatedEmissionsMeasurement smallIslandSurrenderReduction = getOrCalculateSmallIslandSurrenderReduction(
                    smallIslandFerryOperatorReduction, aer.getVoyageEmissions(), aer.getPortEmissions(), emissions);

                if (emissionsWithinUKPorts != null && emissionsBetweenUKPorts != null && emissionsBetweenUKAndEEAVoyages != null) {
                    if (emissions.isFromFetch()) {
                        setFuelConsumptions(aer, emissions, shipEmissions);
                    }

                    BigDecimal totalEmissionsWithinUKPorts = calculateTotal(emissionsWithinUKPorts, 7);
                    emissionsWithinUKPorts.setTotal(totalEmissionsWithinUKPorts);

                    BigDecimal totalEmissionsBetweenUKPorts = calculateTotal(emissionsBetweenUKPorts, 7);
                    emissionsBetweenUKPorts.setTotal(totalEmissionsBetweenUKPorts);

                    BigDecimal totalEmissionsBetweenUKAndEEAVoyages = calculateTotal(emissionsBetweenUKAndEEAVoyages, 7);
                    emissionsBetweenUKAndEEAVoyages.setTotal(totalEmissionsBetweenUKAndEEAVoyages);

                    BigDecimal totalAggregatedEmissionsCo2 =
                        emissionsWithinUKPorts.getCo2()
                            .add(emissionsBetweenUKPorts.getCo2())
                            .add(emissionsBetweenUKAndEEAVoyages.getCo2()).setScale(7, RoundingMode.HALF_UP);

                    BigDecimal totalAggregatedEmissionsCo2Captured =
                        emissionsWithinUKPorts.getCo2Captured()
                            .add(emissionsBetweenUKPorts.getCo2Captured())
                            .add(emissionsBetweenUKAndEEAVoyages.getCo2Captured()).setScale(7, RoundingMode.HALF_UP);

                    BigDecimal totalAggregatedEmissionsCh4 =
                        emissionsWithinUKPorts.getCh4()
                            .add(emissionsBetweenUKPorts.getCh4())
                            .add(emissionsBetweenUKAndEEAVoyages.getCh4()).setScale(7, RoundingMode.HALF_UP);

                    BigDecimal totalAggregatedEmissionsN2o =
                        emissionsWithinUKPorts.getN2o()
                            .add(emissionsBetweenUKPorts.getN2o())
                            .add(emissionsBetweenUKAndEEAVoyages.getN2o()).setScale(7, RoundingMode.HALF_UP);

                    BigDecimal totalAggregatedEmissionsTotal =
                        totalEmissionsWithinUKPorts
                            .add(totalEmissionsBetweenUKPorts)
                            .add(totalEmissionsBetweenUKAndEEAVoyages).setScale(7, RoundingMode.HALF_UP);

                    emissions.setTotalEmissionsFromVoyagesAndPorts(
                        AerPortEmissionsMeasurement.builder()
                            .co2(totalAggregatedEmissionsCo2)
                            .n2o(totalAggregatedEmissionsN2o)
                            .ch4(totalAggregatedEmissionsCh4)
                            .total(totalAggregatedEmissionsTotal)
                            .build()
                    );
                    emissions.setTotalAggregatedEmissions(
                        AerAggregatedEmissionsMeasurement
                            .builder()
                            .co2(totalAggregatedEmissionsCo2)
                            .co2Captured(totalAggregatedEmissionsCo2Captured)
                            .ch4(totalAggregatedEmissionsCh4)
                            .n2o(totalAggregatedEmissionsN2o)
                            .total(totalAggregatedEmissionsTotal)
                            .build()
                    );

                    BigDecimal sifCo2 = BigDecimal.ZERO;
                    BigDecimal sifCo2Captured = BigDecimal.ZERO;
                    BigDecimal sifCh4 = BigDecimal.ZERO;
                    BigDecimal sifN2o = BigDecimal.ZERO;
                    if (smallIslandFerryOperatorReduction && smallIslandSurrenderReduction != null) {
                        sifCo2 = smallIslandSurrenderReduction.getCo2();
                        sifCo2Captured = smallIslandSurrenderReduction.getCo2Captured();
                        sifCh4 = smallIslandSurrenderReduction.getCh4();
                        sifN2o = smallIslandSurrenderReduction.getN2o();

                        BigDecimal totalSmallIslandSurrenderReduction = calculateTotal(smallIslandSurrenderReduction, 7);
                        smallIslandSurrenderReduction.setTotal(totalSmallIslandSurrenderReduction);
                    }

                    BigDecimal lessCapturedCo2Co2 = totalAggregatedEmissionsCo2
                        .subtract(totalAggregatedEmissionsCo2Captured).setScale(7, RoundingMode.HALF_UP);
                    BigDecimal lessCapturedCo2Ch4 = totalAggregatedEmissionsCh4;
                    BigDecimal lessCapturedCo2N2o = totalAggregatedEmissionsN2o;
                    BigDecimal totalLessCapturedCo2 =
                        lessCapturedCo2Co2
                            .add(lessCapturedCo2Ch4)
                            .add(lessCapturedCo2N2o).setScale(7, RoundingMode.HALF_UP);

                    emissions.setLessCapturedCo2(
                        AerPortEmissionsMeasurement.builder()
                            .co2(lessCapturedCo2Co2)
                            .n2o(lessCapturedCo2N2o)
                            .ch4(lessCapturedCo2Ch4)
                            .total(totalLessCapturedCo2)
                            .build()
                    );

                    BigDecimal halfEmissionCo2 = emissionsBetweenUKAndEEAVoyages.getCo2().multiply(FIFTY_PERCENT);
                    BigDecimal halfCapturedCo2 = emissionsBetweenUKAndEEAVoyages.getCo2Captured().multiply(FIFTY_PERCENT);
                    BigDecimal lessVoyagesNotInScopeCo2 = lessCapturedCo2Co2.subtract(halfEmissionCo2).add(halfCapturedCo2).setScale(7, RoundingMode.HALF_UP);

                    BigDecimal halfEmissionN2o = emissionsBetweenUKAndEEAVoyages.getN2o().multiply(FIFTY_PERCENT);
                    BigDecimal lessVoyagesNotInScopeN2o = lessCapturedCo2N2o.subtract(halfEmissionN2o).setScale(7, RoundingMode.HALF_UP);

                    BigDecimal halfEmissionCh4 = emissionsBetweenUKAndEEAVoyages.getCh4().multiply(FIFTY_PERCENT);
                    BigDecimal lessVoyagesNotInScopeCh4 = lessCapturedCo2Ch4.subtract(halfEmissionCh4).setScale(7, RoundingMode.HALF_UP);

                    BigDecimal totalLessVoyagesNotInScope =
                        lessVoyagesNotInScopeCo2
                            .add(lessVoyagesNotInScopeN2o)
                            .add(lessVoyagesNotInScopeCh4)
                            .setScale(7, RoundingMode.HALF_UP);

                    emissions.setLessVoyagesNotInScope(
                        AerPortEmissionsMeasurement.builder()
                            .co2(lessVoyagesNotInScopeCo2)
                            .n2o(lessVoyagesNotInScopeN2o)
                            .ch4(lessVoyagesNotInScopeCh4)
                            .total(totalLessVoyagesNotInScope)
                            .build()
                    );

                    emissions.setTotalShipEmissions(totalLessVoyagesNotInScope);

                    BigDecimal lessIslandFerryDeductionCo2 = lessVoyagesNotInScopeCo2;
                    BigDecimal lessIslandFerryDeductionCh4 = lessVoyagesNotInScopeCh4;
                    BigDecimal lessIslandFerryDeductionN2o = lessVoyagesNotInScopeN2o;
                    BigDecimal totalLessIslandFerryDeduction = totalLessVoyagesNotInScope;

                    if (smallIslandFerryOperatorReduction) {
                        lessIslandFerryDeductionCo2 = lessIslandFerryDeductionCo2.subtract(sifCo2).add(sifCo2Captured)
                            .setScale(7, RoundingMode.HALF_UP);
                        lessIslandFerryDeductionCh4 = lessIslandFerryDeductionCh4.subtract(sifCh4)
                            .setScale(7, RoundingMode.HALF_UP);
                        lessIslandFerryDeductionN2o = lessIslandFerryDeductionN2o.subtract(sifN2o)
                            .setScale(7, RoundingMode.HALF_UP);

                        totalLessIslandFerryDeduction =
                            lessIslandFerryDeductionCo2
                                .add(lessIslandFerryDeductionCh4)
                                .add(lessIslandFerryDeductionN2o)
                                .setScale(7, RoundingMode.HALF_UP);

                    } else {
                        emissions.setSmallIslandSurrenderReduction(null);
                    }

                    emissions.setLessIslandFerryDeduction(
                        AerPortEmissionsMeasurement.builder()
                            .co2(lessIslandFerryDeductionCo2)
                            .n2o(lessIslandFerryDeductionN2o)
                            .ch4(lessIslandFerryDeductionCh4)
                            .total(totalLessIslandFerryDeduction)
                            .build()
                    );

                    boolean hasIceClassDerogation = Boolean.TRUE.equals(shipEmissions.getDetails().getHasIceClassDerogation());
                    BigDecimal less5PercentIceClassDeductionCo2 = lessIslandFerryDeductionCo2;
                    BigDecimal less5PercentIceClassDeductionCh4 = lessIslandFerryDeductionCh4;
                    BigDecimal less5PercentIceClassDeductionN2o = lessIslandFerryDeductionN2o;

                    BigDecimal totalLess5PercentIceClassDeduction =
                        less5PercentIceClassDeductionCo2
                            .add(less5PercentIceClassDeductionCh4)
                            .add(less5PercentIceClassDeductionN2o)
                            .setScale(7, RoundingMode.HALF_UP);

                    if (hasIceClassDerogation) {
                        less5PercentIceClassDeductionCo2 = less5PercentIceClassDeductionCo2.multiply(NINETY_FIVE_PERCENT)
                            .setScale(7, RoundingMode.HALF_UP);
                        less5PercentIceClassDeductionCh4 = less5PercentIceClassDeductionCh4.multiply(NINETY_FIVE_PERCENT)
                            .setScale(7, RoundingMode.HALF_UP);
                        less5PercentIceClassDeductionN2o = less5PercentIceClassDeductionN2o.multiply(NINETY_FIVE_PERCENT)
                            .setScale(7, RoundingMode.HALF_UP);

                        totalLess5PercentIceClassDeduction =
                            less5PercentIceClassDeductionCo2
                                .add(less5PercentIceClassDeductionCh4)
                                .add(less5PercentIceClassDeductionN2o)
                                .setScale(7, RoundingMode.HALF_UP);
                    }

                    emissions.setLess5PercentIceClassDeduction(
                        AerPortEmissionsMeasurement.builder()
                            .co2(less5PercentIceClassDeductionCo2)
                            .n2o(less5PercentIceClassDeductionN2o)
                            .ch4(less5PercentIceClassDeductionCh4)
                            .total(totalLess5PercentIceClassDeduction)
                            .build()
                    );

                    emissions.setSurrenderEmissions(totalLess5PercentIceClassDeduction);
                }
            }

        }
    }

    private AerAggregatedEmissionsMeasurement getOrCalculateEmissionsWithinUKPorts(
        AerPortEmissions portEmissions, AerShipAggregatedData emissions) {

        if (emissions.isFromFetch()) {
            AerAggregatedEmissionsMeasurement calculatedEmissions =
                calculatePortEmissions(portEmissions, emissions, aerVoyage -> true);

            emissions.setEmissionsWithinUKPorts(calculatedEmissions);

            return calculatedEmissions;
        } else {
            return emissions.getEmissionsWithinUKPorts();
        }
    }

    private AerAggregatedEmissionsMeasurement getOrCalculateEmissionsBetweenUKPorts(
        AerVoyageEmissions voyageEmissions, AerShipAggregatedData emissions) {

        if (emissions.isFromFetch()) {
            AerAggregatedEmissionsMeasurement calculatedEmissions = calculateVoyageEmissions(voyageEmissions, emissions,
                aerVoyage -> filterByJourneyType(aerVoyage, PortType.GB));

            emissions.setEmissionsBetweenUKPorts(calculatedEmissions);

            return calculatedEmissions;
        } else {
            return emissions.getEmissionsBetweenUKPorts();
        }
    }

    private AerAggregatedEmissionsMeasurement getOrCalculateEmissionsBetweenUKAndEEAVoyages(
        AerVoyageEmissions voyageEmissions, AerShipAggregatedData emissions) {

        if (emissions.isFromFetch()) {
            AerAggregatedEmissionsMeasurement calculatedEmissions = calculateVoyageEmissions(voyageEmissions, emissions,
                aerVoyage -> filterByJourneyType(aerVoyage, PortType.EU));

            emissions.setEmissionsBetweenUKAndEEAVoyages(calculatedEmissions);

            return calculatedEmissions;
        } else {
            return emissions.getEmissionsBetweenUKAndEEAVoyages();
        }
    }

    private AerAggregatedEmissionsMeasurement getOrCalculateSmallIslandSurrenderReduction(
        boolean smallIslandFerryOperatorReduction,
        AerVoyageEmissions voyageEmissions, AerPortEmissions portEmissions, AerShipAggregatedData emissions) {

        if (emissions.isFromFetch() && smallIslandFerryOperatorReduction) {

            AerAggregatedEmissionsMeasurement aggregatedPortEmissions = calculatePortEmissions(portEmissions,
                emissions, aerPort -> aerPort.getPortDetails() != null && Boolean.TRUE.equals(aerPort.getPortDetails().getSmallIslandFerryReduction()));

            AerAggregatedEmissionsMeasurement aggregatedVoyageEmissions =
                calculateVoyageEmissions(voyageEmissions, emissions,
                    aerVoyage ->
                        (filterByJourneyType(aerVoyage, PortType.EU) || filterByJourneyType(aerVoyage, PortType.GB))
                        && Boolean.TRUE.equals(aerVoyage.getVoyageDetails().getSmallIslandFerryReduction()));

            AerAggregatedEmissionsMeasurement calculatedEmissions = AerAggregatedEmissionsMeasurement.builder()
                .co2(aggregatedPortEmissions.getCo2().add(aggregatedVoyageEmissions.getCo2()).setScale(7, RoundingMode.HALF_UP))
                .ch4(aggregatedPortEmissions.getCh4().add(aggregatedVoyageEmissions.getCh4()).setScale(7, RoundingMode.HALF_UP))
                .n2o(aggregatedPortEmissions.getN2o().add(aggregatedVoyageEmissions.getN2o()).setScale(7, RoundingMode.HALF_UP))
                .co2Captured(aggregatedPortEmissions.getCo2Captured().add(aggregatedVoyageEmissions.getCo2Captured()).setScale(7, RoundingMode.HALF_UP))
                .total(aggregatedPortEmissions.getTotal().add(aggregatedVoyageEmissions.getTotal()).setScale(7, RoundingMode.HALF_UP))
                .build();

            emissions.setSmallIslandSurrenderReduction(calculatedEmissions);

            return calculatedEmissions;
        } else {
            return emissions.getSmallIslandSurrenderReduction();
        }
    }

    private AerAggregatedEmissionsMeasurement calculatePortEmissions(
        AerPortEmissions portEmissions, AerShipAggregatedData emissions, Predicate<AerPort> filterCriteria) {

        AerAggregatedEmissionsMeasurement aggregatedEmissions = AerAggregatedEmissionsMeasurement.builder()
            .co2(BigDecimal.ZERO)
            .ch4(BigDecimal.ZERO)
            .n2o(BigDecimal.ZERO)
            .co2Captured(BigDecimal.ZERO)
            .total(BigDecimal.ZERO)
            .build();

        List<AerPort> ports = portEmissions.getPorts().stream()
            .filter(aerPort -> aerPort.getImoNumber().equals(emissions.getImoNumber()))
            .filter(filterCriteria)
            .toList();

        ports.stream()
            .map(AerPort::getTotalEmissions)
            .forEach(
                measurement -> {
                    aggregatedEmissions.setCo2(aggregatedEmissions.getCo2().add(measurement.getCo2()).setScale(7, RoundingMode.HALF_UP));
                    aggregatedEmissions.setCh4(aggregatedEmissions.getCh4().add(measurement.getCh4()).setScale(7, RoundingMode.HALF_UP));
                    aggregatedEmissions.setN2o(aggregatedEmissions.getN2o().add(measurement.getN2o()).setScale(7, RoundingMode.HALF_UP));
                    aggregatedEmissions.setTotal(aggregatedEmissions.getTotal().add(measurement.getTotal()).setScale(7, RoundingMode.HALF_UP));
                }
            );

        BigDecimal ccsAndCcu = ports.stream()
                .map(AerPort::getPortDetails)
                .filter(Objects::nonNull)
                .map(AerPortDetails::getCcsAndCcu)
                .reduce(BigDecimal::add)
                .orElse(BigDecimal.ZERO);

        aggregatedEmissions.setCo2Captured(ccsAndCcu.setScale(7, RoundingMode.HALF_UP));

        return aggregatedEmissions;
    }

    private AerAggregatedEmissionsMeasurement calculateVoyageEmissions(
        AerVoyageEmissions voyageEmissions, AerShipAggregatedData emissions, Predicate<AerVoyage> filterCriteria) {

        AerAggregatedEmissionsMeasurement aggregatedEmissions = AerAggregatedEmissionsMeasurement.builder()
            .co2(BigDecimal.ZERO)
            .ch4(BigDecimal.ZERO)
            .n2o(BigDecimal.ZERO)
            .co2Captured(BigDecimal.ZERO)
            .total(BigDecimal.ZERO)
            .build();

        List<AerVoyage> voyages = voyageEmissions.getVoyages().stream()
            .filter(aerVoyage -> aerVoyage.getImoNumber().equals(emissions.getImoNumber()))
            .filter(filterCriteria)
            .toList();

        voyages.stream()
            .map(AerVoyage::getTotalEmissions)
            .forEach(
                measurement -> {
                    aggregatedEmissions.setCo2(aggregatedEmissions.getCo2().add(measurement.getCo2()).setScale(7, RoundingMode.HALF_UP));
                    aggregatedEmissions.setCh4(aggregatedEmissions.getCh4().add(measurement.getCh4()).setScale(7, RoundingMode.HALF_UP));
                    aggregatedEmissions.setN2o(aggregatedEmissions.getN2o().add(measurement.getN2o()).setScale(7, RoundingMode.HALF_UP));
                    aggregatedEmissions.setTotal(aggregatedEmissions.getTotal().add(measurement.getTotal()).setScale(7, RoundingMode.HALF_UP));
                }
            );

        BigDecimal ccsAndCcu = voyages.stream()
            .map(port -> port.getVoyageDetails().getCcsAndCcu())
            .reduce(BigDecimal::add).orElse(BigDecimal.ZERO);

        aggregatedEmissions.setCo2Captured(ccsAndCcu.setScale(7, RoundingMode.HALF_UP));

        return aggregatedEmissions;
    }

    private BigDecimal calculateTotal(AerAggregatedEmissionsMeasurement emissions, int scale) {
        return emissions.getCo2().add(emissions.getCh4()).add(emissions.getN2o()).setScale(scale, RoundingMode.HALF_UP);
    }

    private boolean filterByJourneyType(AerVoyage aerVoyage, PortType portType) {
        if (aerVoyage.getVoyageDetails() != null){
            return portType.equals(AerPortCodesUtils.getJourneyType(
                    aerVoyage.getVoyageDetails().getDeparturePort().getCountry(),
                    aerVoyage.getVoyageDetails().getArrivalPort().getCountry()));
        }
        return false;
    }

    private void setFuelConsumptions(Aer aer, AerShipAggregatedData aggregatedData, AerShipEmissions emissions) {
        HashMap<FuelOriginTypeName, BigDecimal> totalFuelConsumptions = new HashMap<>();

        aer.getPortEmissions().getPorts().stream()
            .filter(aerPort -> aerPort.getImoNumber().equals(aggregatedData.getImoNumber()))
            .flatMap(aerPort -> aerPort.getFuelConsumptions().stream())
            .forEach(aerFuelConsumption -> addTotalFuelConsumption(aerFuelConsumption, totalFuelConsumptions));

        aer.getVoyageEmissions().getVoyages().stream()
            .filter(aerPort -> aerPort.getImoNumber().equals(aggregatedData.getImoNumber()))
            .flatMap(aerPort -> aerPort.getFuelConsumptions().stream())
            .forEach(aerFuelConsumption -> addTotalFuelConsumption(aerFuelConsumption, totalFuelConsumptions));

        // if totalFuelConsumptions is empty then use all fuels from list of ships with total consumption of zero.
        if (totalFuelConsumptions.isEmpty()) {
            emissions.getFuelsAndEmissionsFactors()
                .forEach(fuelsAndEmissionsFactors ->
                    totalFuelConsumptions.put(AerValidatorHelper.buildFuelOriginTypeNameWithUuid(fuelsAndEmissionsFactors), new BigDecimal("0.00000")));
        }

        aggregatedData.setFuelConsumptions(
            totalFuelConsumptions.entrySet().stream().map(consumptions ->
                    AerAggregatedDataFuelConsumption
                        .builder()
                        .fuelOriginTypeName(AerValidatorHelper.buildAerFuelOriginTypeNameWithUuid(consumptions.getKey()))
                        .totalConsumption(consumptions.getValue()).build())
                .collect(Collectors.toSet())
        );
    }

    private void addTotalFuelConsumption(AerFuelConsumption aerFuelConsumption,
                                         HashMap<FuelOriginTypeName, BigDecimal> totalFuelConsumptions) {
        BigDecimal currentFuelConsumption = totalFuelConsumptions.getOrDefault(
            aerFuelConsumption.getFuelOriginTypeName(), new BigDecimal("0"));

        totalFuelConsumptions.put(
            aerFuelConsumption.getFuelOriginTypeName(),
            currentFuelConsumption.add(aerFuelConsumption.getTotalConsumption()).setScale(5, RoundingMode.HALF_UP)
        );
    }
}
