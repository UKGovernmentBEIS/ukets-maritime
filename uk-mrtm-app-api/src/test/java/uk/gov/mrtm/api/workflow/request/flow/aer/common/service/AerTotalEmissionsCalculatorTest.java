package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfDetails;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(MockitoExtension.class)
class AerTotalEmissionsCalculatorTest {

    @InjectMocks
    private AerTotalEmissionsCalculator calculator;

    @ParameterizedTest
    @MethodSource("validScenarios")
    void calculate_emissions(AerTotalEmissions expectedEmissions, Set<AerShipAggregatedData> emissions,
                             AerSmfDetails smfDetails) {

        final AerAggregatedData aggregatedData = AerAggregatedData.builder()
            .emissions(emissions)
            .build();

        final AerSmf smf = AerSmf.builder()
            .smfDetails(smfDetails)
            .build();

        Aer aer = Aer.builder()
            .aggregatedData(aggregatedData)
            .smf(smf)
            .build();

        calculator.calculateEmissions(aer);

        assertNotNull(aer.getTotalEmissions());
        assertThat(aer.getTotalEmissions()).isEqualTo(expectedEmissions);
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
                Arguments.of(
                        buildAerTotalEmissions(
                            buildAerPortEmissionsMeasurement(new BigDecimal("800.0000000"), new BigDecimal("700.0000000"), new BigDecimal("500.0000000"), new BigDecimal("2000.0000000")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("679.6875000"), new BigDecimal("685.0000000"), new BigDecimal("440.0000000"), new BigDecimal("1804.6875000")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("750.0000000"), new BigDecimal("700.0000000"), new BigDecimal("500.0000000"), new BigDecimal("1950.0000000")),
                            new BigDecimal("1950.0000000"), new BigDecimal("1804.6875000"), new BigDecimal("1950"), new BigDecimal("1805")),
                        Set.of(
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("500.0000000"), new BigDecimal("300.0000000"), new BigDecimal("200.0000000")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("50.0000000"), new BigDecimal("10.0000000"), new BigDecimal("40.0000000"))),
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("300.0000000"), new BigDecimal("400.0000000"), new BigDecimal("300.0000000")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("100.0000000"), new BigDecimal("20.0000000"), new BigDecimal("80.0000000")))),
                        buildAerSmfDetails(new BigDecimal("50.0000000"))
                ),
                Arguments.of(
                        buildAerTotalEmissions(
                            buildAerPortEmissionsMeasurement(new BigDecimal("800.0000000"), new BigDecimal("700.0000000"), new BigDecimal("500.0000000"), new BigDecimal("2000.0000000")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("725.0000000"), new BigDecimal("685.0000000"), new BigDecimal("440.0000000"), new BigDecimal("1850.0000000")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("800.0000000"), new BigDecimal("700.0000000"), new BigDecimal("500.0000000"), new BigDecimal("2000.0000000")),
                            new BigDecimal("2000.0000000"), new BigDecimal("1850.0000000"), new BigDecimal("2000"), new BigDecimal("1850")),
                        Set.of(
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("500.0000000"), new BigDecimal("300.0000000"), new BigDecimal("200.0000000")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("50.0000000"), new BigDecimal("10.0000000"), new BigDecimal("40.0000000"))),
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("300.0000000"), new BigDecimal("400.0000000"), new BigDecimal("300.0000000")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("100.0000000"), new BigDecimal("20.0000000"), new BigDecimal("80.0000000")))),
                        null
                ),
                Arguments.of(
                        buildAerTotalEmissions(
                            buildAerPortEmissionsMeasurement(new BigDecimal("799.9876543"), new BigDecimal("702.1234567"), new BigDecimal("500.5432198"), new BigDecimal("2002.6543308")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("679.7330977"), new BigDecimal("687.1298950"), new BigDecimal("440.3703804"), new BigDecimal("1807.2333731")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("749.9876543"), new BigDecimal("702.1234567"), new BigDecimal("500.5432198"), new BigDecimal("1952.6543308")),
                            new BigDecimal("1952.6543308"), new BigDecimal("1807.2333731"), new BigDecimal("1953"), new BigDecimal("1807")),
                        Set.of(
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("499.9876543"), new BigDecimal("300.1234567"), new BigDecimal("200.3456789")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("49.8765432"), new BigDecimal("9.9876543"), new BigDecimal("40.3456789"))),
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("300"), new BigDecimal("402"), new BigDecimal("300.1975409")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("100"), new BigDecimal("19.9994691"), new BigDecimal("80")))),
                        buildAerSmfDetails(new BigDecimal("50"))
                ),
                Arguments.of(
                        buildAerTotalEmissions(
                            buildAerPortEmissionsMeasurement(new BigDecimal("800.7465123"), new BigDecimal("702.7894561"), new BigDecimal("500.0031245"), new BigDecimal("2003.5390929")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("725.7431178"), new BigDecimal("687.7873244"), new BigDecimal("439.9988865"), new BigDecimal("1853.5293287")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("800.7465123"), new BigDecimal("702.7894561"), new BigDecimal("500.0031245"), new BigDecimal("2003.5390929")),
                            new BigDecimal("2003.5390929"), new BigDecimal("1853.5293287"), new BigDecimal("2004"), new BigDecimal("1854")),
                        Set.of(
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("500.7465123"), new BigDecimal("300.7894561"), new BigDecimal("200.0031245")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("50.0067891"), new BigDecimal("10.0042635"), new BigDecimal("40.0084761"))),
                            buildAerShipAggregatedData(
                                buildAerPortEmissionsMeasurement(new BigDecimal("300"), new BigDecimal("402"), new BigDecimal("300")),
                                buildAerPortEmissionsMeasurement(new BigDecimal("100"), new BigDecimal("20"), new BigDecimal("80")))),
                        null
                ),
                Arguments.of(
                    buildAerTotalEmissions(
                        buildAerPortEmissionsMeasurement(new BigDecimal("0.0000000"), new BigDecimal("700.0000000"), new BigDecimal("500.0000000"), new BigDecimal("1200.0000000")),
                        buildAerPortEmissionsMeasurement(new BigDecimal("-50.0000000"), new BigDecimal("685.0000000"), new BigDecimal("440.0000000"), new BigDecimal("1075.0000000")),
                        buildAerPortEmissionsMeasurement(new BigDecimal("-50.0000000"), new BigDecimal("700.0000000"), new BigDecimal("500.0000000"), new BigDecimal("1150.0000000")),
                        new BigDecimal("1150.0000000"), new BigDecimal("1075.0000000"), new BigDecimal("1150"), new BigDecimal("1075")),
                    Set.of(
                        buildAerShipAggregatedData(
                            buildAerPortEmissionsMeasurement(new BigDecimal("0"), new BigDecimal("300.0000000"), new BigDecimal("200.0000000")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("50.0000000"), new BigDecimal("10.0000000"), new BigDecimal("40.0000000"))),
                        buildAerShipAggregatedData(
                            buildAerPortEmissionsMeasurement(new BigDecimal("0"), new BigDecimal("400.0000000"), new BigDecimal("300.0000000")),
                            buildAerPortEmissionsMeasurement(new BigDecimal("100.0000000"), new BigDecimal("20.0000000"), new BigDecimal("80.0000000")))),
                    buildAerSmfDetails(new BigDecimal("50.0000000"))
                )
        );
    }

    @ParameterizedTest
    @MethodSource("invalidScenarios")
    void calculate_no_calculations(AerAggregatedData aggregatedData, AerSmf smf) {

        Aer aer = Aer.builder()
            .aggregatedData(aggregatedData)
            .smf(smf)
            .build();

        calculator.calculateEmissions(aer);

        assertNull(aer.getTotalEmissions());
    }

    public static Stream<Arguments> invalidScenarios() {
        return Stream.of(
                Arguments.of(
                        AerAggregatedData.builder().build(), null
                ),
                Arguments.of(
                        null, AerSmf.builder().build()
                )
        );
    }

    private static AerPortEmissionsMeasurement buildAerPortEmissionsMeasurement(BigDecimal co2, BigDecimal ch4, BigDecimal no2) {
        return AerPortEmissionsMeasurement.builder()
                .co2(co2)
                .ch4(ch4)
                .n2o(no2)
                .total(co2.add(ch4).add(no2).setScale(7, RoundingMode.HALF_UP))
                .build();
    }

    private static AerPortEmissionsMeasurement buildAerPortEmissionsMeasurement(BigDecimal co2, BigDecimal ch4, BigDecimal no2, BigDecimal total) {
        return AerPortEmissionsMeasurement.builder()
                .co2(co2)
                .ch4(ch4)
                .n2o(no2)
                .total(total)
                .build();
    }

    private static AerShipAggregatedData buildAerShipAggregatedData(AerPortEmissionsMeasurement totalEmissionsFromVoyagesAndPorts,
                                                                    AerPortEmissionsMeasurement emissionsBetweenUKAndNIVoyages) {
        return AerShipAggregatedData.builder()
                .totalEmissionsFromVoyagesAndPorts(totalEmissionsFromVoyagesAndPorts)
                .emissionsBetweenUKAndNIVoyages(emissionsBetweenUKAndNIVoyages)
                .build();
    }

    private static AerTotalEmissions buildAerTotalEmissions(AerPortEmissionsMeasurement totalEmissions, AerPortEmissionsMeasurement lessVoyagesInNorthernIrelandDeduction,
                                                            AerPortEmissionsMeasurement lessEmissionsReductionClaim, BigDecimal totalShipEmissions, BigDecimal surrenderEmissions,
                                                            BigDecimal totalShipEmissionsSummary, BigDecimal surrenderEmissionsSummary) {
        return AerTotalEmissions.builder()
                .totalEmissions(totalEmissions)
                .lessVoyagesInNorthernIrelandDeduction(lessVoyagesInNorthernIrelandDeduction)
                .lessEmissionsReductionClaim(lessEmissionsReductionClaim)
                .totalShipEmissions(totalShipEmissions)
                .surrenderEmissions(surrenderEmissions)
                .totalShipEmissionsSummary(totalShipEmissionsSummary)
                .surrenderEmissionsSummary(surrenderEmissionsSummary)
                .build();
    }

    private static AerSmfDetails buildAerSmfDetails(BigDecimal totalSustainableEmissions) {
        return AerSmfDetails.builder()
                .totalSustainableEmissions(totalSustainableEmissions)
                .build();
    }
}