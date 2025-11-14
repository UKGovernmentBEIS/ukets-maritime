package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPort;
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
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.FIFTY_PERCENT;
import static uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerEmissionsCalculatorUtils.sumAndScale;

@Service
@RequiredArgsConstructor
public class AerAggregatedDataEmissionsCalculator {

    public void calculateEmissions(Aer aer) {
        if (aer == null || aer.getEmissions() == null || aer.getAggregatedData() == null) {
            return;
        }

        filterOutNonEligibleFetchedShips(aer);

        for (AerShipAggregatedData emissions : aer.getAggregatedData().getEmissions()) {
            Optional<AerShipEmissions> shipEmissionsOptional = aer.getEmissions().getShips().stream()
                    .filter(aerShipEmission -> aerShipEmission.getDetails().getImoNumber().equals(emissions.getImoNumber()))
                    .findFirst();
            if (shipEmissionsOptional.isPresent()) {
                processShipEmissions(aer, emissions, shipEmissionsOptional.get());
            }
        }
    }

    private void filterOutNonEligibleFetchedShips(Aer aer) {
        aer.getAggregatedData().getEmissions()
            .removeIf(data -> {
                if (data.isFromFetch()) {
                    boolean hasPorts = aer.getPortEmissions().getPorts().stream().anyMatch(
                        aerPort -> aerPort.getImoNumber().equals(data.getImoNumber())
                    );

                    if (hasPorts) {
                        return false;
                    }

                    boolean hasNIOrGBVoyages = aer.getVoyageEmissions().getVoyages().stream().anyMatch(
                        aerVoyage -> aerVoyage.getImoNumber().equals(data.getImoNumber())
                            && (filterByJourneyType(aerVoyage, PortType.GB) || filterByJourneyType(aerVoyage, PortType.NI))
                    );

                    if (hasNIOrGBVoyages) {
                        return false;
                    }

                    return true;
                }
                return false;
            });
    }

    private void processShipEmissions(Aer aer, AerShipAggregatedData emissions, AerShipEmissions shipEmissions) {
        AerPortEmissionsMeasurement emissionsWithinUKPorts = getOrCalculateEmissionsWithinUKPorts(
                aer.getPortEmissions(), emissions);

        AerPortEmissionsMeasurement emissionsBetweenUKPorts = getOrCalculateEmissionsBetweenUKPorts(
                aer.getVoyageEmissions(), emissions);

        AerPortEmissionsMeasurement emissionsBetweenUKAndNIVoyages = getOrCalculateEmissionsBetweenUKAndNIVoyages(
                aer.getVoyageEmissions(), emissions);

        if (emissionsWithinUKPorts != null && emissionsBetweenUKPorts != null && emissionsBetweenUKAndNIVoyages != null) {
            if (emissions.isFromFetch()) {
                setFuelConsumptions(aer, emissions, shipEmissions);
            }

            calculateAndSetTotalEmissionsFromVoyagesAndPorts(emissions, emissionsWithinUKPorts, emissionsBetweenUKPorts,
                emissionsBetweenUKAndNIVoyages);

            calculateAndSetLessVoyagesInNorthernIreland(emissions, emissions.getTotalEmissionsFromVoyagesAndPorts(),
                emissionsBetweenUKAndNIVoyages);
        }
    }

    private void calculateAndSetTotalEmissionsFromVoyagesAndPorts(AerShipAggregatedData emissions,
                                                                  AerPortEmissionsMeasurement emissionsWithinUKPorts,
                                                                  AerPortEmissionsMeasurement emissionsBetweenUKPorts,
                                                                  AerPortEmissionsMeasurement emissionsBetweenUKAndNIVoyages) {

        BigDecimal totalEmissionsWithinUKPorts = calculateTotal(emissionsWithinUKPorts, 7);
        emissionsWithinUKPorts.setTotal(totalEmissionsWithinUKPorts);

        BigDecimal totalEmissionsBetweenUKPorts = calculateTotal(emissionsBetweenUKPorts, 7);
        emissionsBetweenUKPorts.setTotal(totalEmissionsBetweenUKPorts);

        BigDecimal totalEmissionsBetweenUKAndEEAVoyages = calculateTotal(emissionsBetweenUKAndNIVoyages, 7);
        emissionsBetweenUKAndNIVoyages.setTotal(totalEmissionsBetweenUKAndEEAVoyages);

        BigDecimal totalAggregatedEmissionsCo2 = sumAndScale(
                emissionsWithinUKPorts.getCo2(),
                emissionsBetweenUKPorts.getCo2(),
                emissionsBetweenUKAndNIVoyages.getCo2());

        BigDecimal totalAggregatedEmissionsCh4 = sumAndScale(
                emissionsWithinUKPorts.getCh4(),
                emissionsBetweenUKPorts.getCh4(),
                emissionsBetweenUKAndNIVoyages.getCh4());

        BigDecimal totalAggregatedEmissionsN2o = sumAndScale(
                emissionsWithinUKPorts.getN2o(),
                emissionsBetweenUKPorts.getN2o(),
                emissionsBetweenUKAndNIVoyages.getN2o());

        BigDecimal totalAggregatedEmissionsTotal = sumAndScale(
                totalEmissionsWithinUKPorts,
                totalEmissionsBetweenUKPorts,
                totalEmissionsBetweenUKAndEEAVoyages);

        AerPortEmissionsMeasurement totalEmissionsFromVoyagesAndPorts = AerPortEmissionsMeasurement.builder()
            .co2(totalAggregatedEmissionsCo2)
            .ch4(totalAggregatedEmissionsCh4)
            .n2o(totalAggregatedEmissionsN2o)
            .total(totalAggregatedEmissionsTotal)
            .build();

        emissions.setTotalEmissionsFromVoyagesAndPorts(
            totalEmissionsFromVoyagesAndPorts
        );

        emissions.setTotalShipEmissions(totalAggregatedEmissionsTotal);
    }

    private void calculateAndSetLessVoyagesInNorthernIreland(AerShipAggregatedData emissions,
                                                             AerPortEmissionsMeasurement totalEmissionsFromVoyagesAndPorts,
                                                             AerPortEmissionsMeasurement emissionsBetweenUKAndNIVoyages) {
        BigDecimal halfEmissionCo2 = emissionsBetweenUKAndNIVoyages.getCo2().multiply(FIFTY_PERCENT);
        BigDecimal lessVoyagesInNorthernIrelandDeductionCo2 = totalEmissionsFromVoyagesAndPorts.getCo2()
                .subtract(halfEmissionCo2)
                .setScale(7, RoundingMode.HALF_UP);

        BigDecimal halfEmissionN2o = emissionsBetweenUKAndNIVoyages.getN2o().multiply(FIFTY_PERCENT);
        BigDecimal lessVoyagesInNorthernIrelandDeductionN2o = totalEmissionsFromVoyagesAndPorts.getN2o()
                .subtract(halfEmissionN2o)
                .setScale(7, RoundingMode.HALF_UP);

        BigDecimal halfEmissionCh4 = emissionsBetweenUKAndNIVoyages.getCh4().multiply(FIFTY_PERCENT);
        BigDecimal lessVoyagesInNorthernIrelandDeductionCh4 = totalEmissionsFromVoyagesAndPorts.getCh4()
                .subtract(halfEmissionCh4)
                .setScale(7, RoundingMode.HALF_UP);

        BigDecimal totalLessVoyagesInNorthernIrelandDeduction = lessVoyagesInNorthernIrelandDeductionCo2
                .add(lessVoyagesInNorthernIrelandDeductionN2o)
                .add(lessVoyagesInNorthernIrelandDeductionCh4)
                .setScale(7, RoundingMode.HALF_UP);

        emissions.setLessVoyagesInNorthernIrelandDeduction(
                AerPortEmissionsMeasurement.builder()
                        .co2(lessVoyagesInNorthernIrelandDeductionCo2)
                        .n2o(lessVoyagesInNorthernIrelandDeductionN2o)
                        .ch4(lessVoyagesInNorthernIrelandDeductionCh4)
                        .total(totalLessVoyagesInNorthernIrelandDeduction)
                        .build()
        );

        emissions.setSurrenderEmissions(totalLessVoyagesInNorthernIrelandDeduction);
    }

    private AerPortEmissionsMeasurement getOrCalculateEmissionsWithinUKPorts(
        AerPortEmissions portEmissions, AerShipAggregatedData emissions) {

        if (emissions.isFromFetch()) {
            AerPortEmissionsMeasurement calculatedEmissions = calculatePortEmissions(portEmissions, emissions);

            emissions.setEmissionsWithinUKPorts(calculatedEmissions);

            return calculatedEmissions;
        } else {
            return emissions.getEmissionsWithinUKPorts();
        }
    }

    private AerPortEmissionsMeasurement getOrCalculateEmissionsBetweenUKPorts(
        AerVoyageEmissions voyageEmissions, AerShipAggregatedData emissions) {

        if (emissions.isFromFetch()) {
            AerPortEmissionsMeasurement calculatedEmissions = calculateVoyageEmissions(voyageEmissions, emissions,
                aerVoyage -> filterByJourneyType(aerVoyage, PortType.GB));

            emissions.setEmissionsBetweenUKPorts(calculatedEmissions);

            return calculatedEmissions;
        } else {
            return emissions.getEmissionsBetweenUKPorts();
        }
    }

    private AerPortEmissionsMeasurement getOrCalculateEmissionsBetweenUKAndNIVoyages(
        AerVoyageEmissions voyageEmissions, AerShipAggregatedData emissions) {

        if (emissions.isFromFetch()) {
            AerPortEmissionsMeasurement calculatedEmissions = calculateVoyageEmissions(voyageEmissions, emissions,
                aerVoyage -> filterByJourneyType(aerVoyage, PortType.NI));

            emissions.setEmissionsBetweenUKAndNIVoyages(calculatedEmissions);

            return calculatedEmissions;
        } else {
            return emissions.getEmissionsBetweenUKAndNIVoyages();
        }
    }

    private AerPortEmissionsMeasurement calculatePortEmissions(
        AerPortEmissions portEmissions, AerShipAggregatedData emissions) {

        AerPortEmissionsMeasurement aggregatedEmissions = AerPortEmissionsMeasurement.builder()
            .co2(BigDecimal.ZERO)
            .ch4(BigDecimal.ZERO)
            .n2o(BigDecimal.ZERO)
            .total(BigDecimal.ZERO)
            .build();

        List<AerPort> ports = portEmissions.getPorts().stream()
            .filter(aerPort -> aerPort.getImoNumber().equals(emissions.getImoNumber()))
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

        return aggregatedEmissions;
    }

    private AerPortEmissionsMeasurement calculateVoyageEmissions(
        AerVoyageEmissions voyageEmissions, AerShipAggregatedData emissions, Predicate<AerVoyage> filterCriteria) {

        AerPortEmissionsMeasurement aggregatedEmissions = AerPortEmissionsMeasurement.builder()
            .co2(BigDecimal.ZERO)
            .ch4(BigDecimal.ZERO)
            .n2o(BigDecimal.ZERO)
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

        return aggregatedEmissions;
    }

    private BigDecimal calculateTotal(AerPortEmissionsMeasurement emissions, int scale) {
        return emissions.getCo2().add(emissions.getCh4()).add(emissions.getN2o()).setScale(scale, RoundingMode.HALF_UP);
    }

    private boolean filterByJourneyType(AerVoyage aerVoyage, PortType portType) {
        if (aerVoyage.getVoyageDetails() != null){
            return portType.equals(AerPortCodesUtils.getJourneyType(
                    aerVoyage.getVoyageDetails().getDeparturePort(),
                    aerVoyage.getVoyageDetails().getArrivalPort()));
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
            .filter(aerVoyage -> aerVoyage.getImoNumber().equals(aggregatedData.getImoNumber()))
            .filter(aerVoyage -> filterByJourneyType(aerVoyage, PortType.NI) || filterByJourneyType(aerVoyage, PortType.GB))
            .flatMap(aerVoyage -> aerVoyage.getFuelConsumptions().stream())
            .forEach(aerFuelConsumption -> addTotalFuelConsumption(aerFuelConsumption, totalFuelConsumptions));

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
