package uk.gov.mrtm.api.integration.external.aer.transform;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.AerFuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.AerFuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.AerFuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.MethaneSlipValueType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.integration.external.aer.domain.ExternalAer;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataAnnualEmission;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataEmissions;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataEmissionsMeasurements;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataShipEmissions;
import uk.gov.mrtm.api.integration.external.aer.domain.reductionclaim.ExternalAerReductionClaim;
import uk.gov.mrtm.api.integration.external.aer.domain.reductionclaim.ExternalAerReductionClaimDetails;
import uk.gov.mrtm.api.integration.external.aer.domain.reductionclaim.ExternalAerReductionClaimPurchase;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerDerogations;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerEmissionsSources;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerShipDetails;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerShipEmissions;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelOriginTypeName;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpUncertaintyLevel;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.DataSaveMethod;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfDetails;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerAggregatedDataEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSmfEmissionsCalculator;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class ExternalAerMapperTest {

    private static final UUID METHANOL_FUEL_ID = UUID.randomUUID();
    private static final UUID E_METHANOL_FUEL_ID = UUID.randomUUID();
    private static final UUID BIO_METHANOL_FUEL_ID = UUID.randomUUID();
    private static final UUID OTHER_FUEL_ID = UUID.randomUUID();
    private static final UUID EMISSION_SOURCE = UUID.randomUUID();
    private static final UUID AER_SHIP_EMISSIONS_ID = UUID.randomUUID();
    private static final UUID AGGREGATED_DATA_ID = UUID.randomUUID();
    private static final UUID SMF_PURCHASE_1_ID = UUID.randomUUID();
    private static final UUID SMF_PURCHASE_2_ID = UUID.randomUUID();
    private static final UUID SMF_PURCHASE_3_ID = UUID.randomUUID();
    private static final UUID SMF_PURCHASE_4_ID = UUID.randomUUID();

    @InjectMocks
    private ExternalAerMapper externalAerMapper;

    @Mock
    private AerAggregatedDataEmissionsCalculator aggregatedDataCalculator;
    @Mock
    private AerSmfEmissionsCalculator aerSmfEmissionsCalculator;

    private static MockedStatic<UUID> mockedSettings;

    @BeforeAll
    public static void init() {
        mockedSettings = mockStatic(UUID.class);
    }

    @AfterAll
    public static void close() {
        mockedSettings.close();
    }

    @Test
    void toStagingAer() {
        mockedSettings.when(UUID::randomUUID)
            .thenReturn(METHANOL_FUEL_ID)
            .thenReturn(E_METHANOL_FUEL_ID)
            .thenReturn(BIO_METHANOL_FUEL_ID)
            .thenReturn(OTHER_FUEL_ID)
            .thenReturn(EMISSION_SOURCE)
            .thenReturn(AER_SHIP_EMISSIONS_ID)
            .thenReturn(AGGREGATED_DATA_ID)
            .thenReturn(SMF_PURCHASE_1_ID)
            .thenReturn(SMF_PURCHASE_2_ID)
            .thenReturn(SMF_PURCHASE_3_ID)
            .thenReturn(SMF_PURCHASE_4_ID);

        ExternalAer external = createExternalAer(true);

        StagingAer expected = createStagingAer(true);

        StagingAer actual = externalAerMapper.toStagingAer(external);

        assertEquals(expected, actual);

        verify(aggregatedDataCalculator).calculateEmissions(expected.getAggregatedData(), expected.getEmissions(), null, null);
        verify(aerSmfEmissionsCalculator).calculateEmissions(expected.getSmf());

        verifyNoMoreInteractions(aggregatedDataCalculator, aerSmfEmissionsCalculator);
    }

    @Test
    void toStagingAer_without_optional_fields() {
        mockedSettings.when(UUID::randomUUID)
            .thenReturn(METHANOL_FUEL_ID)
            .thenReturn(E_METHANOL_FUEL_ID)
            .thenReturn(BIO_METHANOL_FUEL_ID)
            .thenReturn(OTHER_FUEL_ID)
            .thenReturn(EMISSION_SOURCE)
            .thenReturn(AER_SHIP_EMISSIONS_ID)
            .thenReturn(AGGREGATED_DATA_ID);

        ExternalAer external = createExternalAer(false);

        StagingAer expected = createStagingAer(false);

        StagingAer actual = externalAerMapper.toStagingAer(external);

        assertEquals(expected, actual);

        verify(aggregatedDataCalculator).calculateEmissions(expected.getAggregatedData(), expected.getEmissions(), null, null);
        verify(aerSmfEmissionsCalculator).calculateEmissions(expected.getSmf());

        verifyNoMoreInteractions(aggregatedDataCalculator, aerSmfEmissionsCalculator);
    }

    private StagingAer createStagingAer(boolean reductionClaimApplied) {
        return StagingAer.builder()
            .emissions(AerEmissions.builder().ships(Set.of(createAerShipEmissions())).build())
            .aggregatedData(createAerAggregatedData())
            .smf(createAerSmf(reductionClaimApplied))
            .build();
    }

    private ExternalAer createExternalAer(boolean reductionClaimApplied) {
        return ExternalAer.builder()
            .shipParticulars(Set.of(createExternalAerShipEmissions()))
            .emissions(createExternalAerAggregatedDataEmissions())
            .reductionClaim(createExternalAerReductionClaim(reductionClaimApplied))
            .build();
    }

    private AerSmf createAerSmf(boolean reductionClaimApplied) {
        return AerSmf.builder()
            .exist(reductionClaimApplied)
            .smfDetails(reductionClaimApplied ?
                AerSmfDetails.builder()
                    .purchases(
                        List.of(
                            AerSmfPurchase.builder()
                                .dataSaveMethod(DataSaveMethod.EXTERNAL_PROVIDER)
                                .batchNumber("batchNumber1")
                                .smfMass(new BigDecimal("1000"))
                                .co2EmissionFactor(new BigDecimal("0.01"))
                                .fuelOriginTypeName(createAerFuelOriginFossilTypeName())
                                .uniqueIdentifier(SMF_PURCHASE_1_ID)
                            .build(),
                            AerSmfPurchase.builder()
                                .dataSaveMethod(DataSaveMethod.EXTERNAL_PROVIDER)
                                .batchNumber("batchNumber2")
                                .smfMass(new BigDecimal("2000"))
                                .co2EmissionFactor(new BigDecimal("0.02"))
                                .fuelOriginTypeName(createAerFuelOriginBioTypeName())
                                .uniqueIdentifier(SMF_PURCHASE_2_ID)
                                .build(),
                            AerSmfPurchase.builder()
                                .dataSaveMethod(DataSaveMethod.EXTERNAL_PROVIDER)
                                .batchNumber("batchNumber3")
                                .smfMass(new BigDecimal("3000"))
                                .co2EmissionFactor(new BigDecimal("0.03"))
                                .fuelOriginTypeName(createAerFuelOriginEFuelTypeName())
                                .uniqueIdentifier(SMF_PURCHASE_3_ID)
                                .build(),
                            AerSmfPurchase.builder()
                                .dataSaveMethod(DataSaveMethod.EXTERNAL_PROVIDER)
                                .batchNumber("batchNumber4")
                                .smfMass(new BigDecimal("4000"))
                                .co2EmissionFactor(new BigDecimal("0.04"))
                                .fuelOriginTypeName(createAerFuelOriginOtherBiofuelTypeName())
                                .uniqueIdentifier(SMF_PURCHASE_4_ID)
                                .build())
                    )
                    .build()
                : null
            )
            .build();
    }

    private AerFuelOriginBiofuelTypeName createAerFuelOriginOtherBiofuelTypeName() {
        return AerFuelOriginBiofuelTypeName.builder()
            .origin(FuelOrigin.BIOFUEL)
            .type(BioFuelType.OTHER)
            .uniqueIdentifier(METHANOL_FUEL_ID)
            .name("otherFuelType")
            .build();
    }

    private AerFuelOriginEFuelTypeName createAerFuelOriginEFuelTypeName() {
        return AerFuelOriginEFuelTypeName.builder()
            .origin(FuelOrigin.RFNBO)
            .type(EFuelType.E_METHANOL)
            .uniqueIdentifier(E_METHANOL_FUEL_ID)
            .build();
    }

    private AerFuelOriginBiofuelTypeName createAerFuelOriginBioTypeName() {
        return AerFuelOriginBiofuelTypeName.builder()
            .origin(FuelOrigin.BIOFUEL)
            .type(BioFuelType.BIO_METHANOL)
            .uniqueIdentifier(BIO_METHANOL_FUEL_ID)
            .build();
    }

    private AerFuelOriginFossilTypeName createAerFuelOriginFossilTypeName() {
        return AerFuelOriginFossilTypeName.builder()
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.METHANOL)
            .uniqueIdentifier(METHANOL_FUEL_ID)
            .build();
    }

    private ExternalAerReductionClaim createExternalAerReductionClaim(boolean reductionClaimApplied) {
        return ExternalAerReductionClaim.builder()
            .reductionClaimApplied(reductionClaimApplied)
            .reductionClaimDetails(reductionClaimApplied ?
                ExternalAerReductionClaimDetails.builder()
                    .fuelPurchaseList(
                        List.of(
                            ExternalAerReductionClaimPurchase.builder()
                                .fuelOriginCode(FuelOrigin.FOSSIL)
                                .fuelTypeCode(ExternalFuelType.METHANOL)
                                .batchNumber("batchNumber1")
                                .fuelMass(new BigDecimal("1000"))
                                .ttwEFCarbonDioxide(new BigDecimal("0.01"))
                                .build(),
                            ExternalAerReductionClaimPurchase.builder()
                                .fuelOriginCode(FuelOrigin.BIOFUEL)
                                .fuelTypeCode(ExternalFuelType.BIO_METHANOL)
                                .batchNumber("batchNumber2")
                                .fuelMass(new BigDecimal("2000"))
                                .ttwEFCarbonDioxide(new BigDecimal("0.02"))
                                .build(),
                            ExternalAerReductionClaimPurchase.builder()
                                .fuelOriginCode(FuelOrigin.RFNBO)
                                .fuelTypeCode(ExternalFuelType.E_METHANOL)
                                .batchNumber("batchNumber3")
                                .fuelMass(new BigDecimal("3000"))
                                .ttwEFCarbonDioxide(new BigDecimal("0.03"))
                                .build(),
                            ExternalAerReductionClaimPurchase.builder()
                                .fuelOriginCode(FuelOrigin.BIOFUEL)
                                .fuelTypeCode(ExternalFuelType.OTHER)
                                .otherFuelType("otherFuelType")
                                .batchNumber("batchNumber4")
                                .fuelMass(new BigDecimal("4000"))
                                .ttwEFCarbonDioxide(new BigDecimal("0.04"))
                                .build())
                    )
                    .build()
                : null)
            .build();
    }

    private AerAggregatedData createAerAggregatedData() {
        return AerAggregatedData.builder()
            .emissions(Set.of(
                AerShipAggregatedData.builder()
                    .imoNumber("9876543")
                    .dataSaveMethod(DataSaveMethod.EXTERNAL_PROVIDER)
                    .uniqueIdentifier(AGGREGATED_DATA_ID)
                    .isFromFetch(false)
                    .fuelConsumptions(
                        Set.of(
                            AerAggregatedDataFuelConsumption.builder()
                                .fuelOriginTypeName(createAerFuelOriginFossilTypeName())
                                .totalConsumption(new BigDecimal("100"))
                                .build(),
                            AerAggregatedDataFuelConsumption.builder()
                                .fuelOriginTypeName(createAerFuelOriginBioTypeName())
                                .totalConsumption(new BigDecimal("200"))
                                .build(),
                            AerAggregatedDataFuelConsumption.builder()
                                .fuelOriginTypeName(createAerFuelOriginEFuelTypeName())
                                .totalConsumption(new BigDecimal("300"))
                                .build(),
                            AerAggregatedDataFuelConsumption.builder()
                                .fuelOriginTypeName(createAerFuelOriginOtherBiofuelTypeName())
                                .totalConsumption(new BigDecimal("400"))
                                .build()
                        )
                    )
                    .emissionsBetweenUKAndNIVoyages(AerPortEmissionsMeasurement.builder()
                        .n2o(new BigDecimal("1"))
                        .ch4(new BigDecimal("2"))
                        .co2(new BigDecimal("3"))
                        .build())
                    .emissionsWithinUKPorts(AerPortEmissionsMeasurement.builder()
                        .n2o(new BigDecimal("4"))
                        .ch4(new BigDecimal("5"))
                        .co2(new BigDecimal("6"))
                        .build())
                    .emissionsBetweenUKPorts(AerPortEmissionsMeasurement.builder()
                        .n2o(new BigDecimal("7"))
                        .ch4(new BigDecimal("8"))
                        .co2(new BigDecimal("9"))
                        .build())
                    .build()
            ))
            .build();
    }

    private ExternalAerAggregatedDataEmissions createExternalAerAggregatedDataEmissions() {
        return ExternalAerAggregatedDataEmissions.builder()
            .shipEmissions(Set.of(
                ExternalAerAggregatedDataShipEmissions.builder()
                    .shipImoNumber("9876543")
                    .annualEmission(ExternalAerAggregatedDataAnnualEmission.builder()
                        .emissions(Set.of(
                            ExternalAerAggregatedDataFuelConsumption.builder()
                                .fuelOriginCode(FuelOrigin.FOSSIL)
                                .fuelTypeCode(ExternalFuelType.METHANOL)
                                .amount(new BigDecimal("100"))
                                .build(),
                            ExternalAerAggregatedDataFuelConsumption.builder()
                                .fuelOriginCode(FuelOrigin.BIOFUEL)
                                .fuelTypeCode(ExternalFuelType.BIO_METHANOL)
                                .amount(new BigDecimal("200"))
                                .build(),
                            ExternalAerAggregatedDataFuelConsumption.builder()
                                .fuelOriginCode(FuelOrigin.RFNBO)
                                .fuelTypeCode(ExternalFuelType.E_METHANOL)
                                .amount(new BigDecimal("300"))
                                .build(),
                            ExternalAerAggregatedDataFuelConsumption.builder()
                                .fuelOriginCode(FuelOrigin.BIOFUEL)
                                .fuelTypeCode(ExternalFuelType.OTHER)
                                .otherFuelType("otherFuelType")
                                .amount(new BigDecimal("400"))
                                .build()
                        ))
                        .etsEmissionsBetweenUkAndNiPort(ExternalAerAggregatedDataEmissionsMeasurements.builder()
                            .tn2oeqTotal(new BigDecimal("1"))
                            .tch4eqTotal(new BigDecimal("2"))
                            .tco2Total(new BigDecimal("3"))
                            .build())
                        .etsEmissionsWithinUkPort(ExternalAerAggregatedDataEmissionsMeasurements.builder()
                            .tn2oeqTotal(new BigDecimal("4"))
                            .tch4eqTotal(new BigDecimal("5"))
                            .tco2Total(new BigDecimal("6"))
                            .build())
                        .etsEmissionsBetweenUkPort(ExternalAerAggregatedDataEmissionsMeasurements.builder()
                            .tn2oeqTotal(new BigDecimal("7"))
                            .tch4eqTotal(new BigDecimal("8"))
                            .tco2Total(new BigDecimal("9"))
                            .build())
                        .build())
                    .build()
            ))
            .build();
    }

    private ExternalAerShipEmissions createExternalAerShipEmissions() {
        Set<ExternalAerFuelsAndEmissionsFactors> fuelTypes = new LinkedHashSet<>();
        fuelTypes.add(createExternalAerFuelsAndEmissionsFactors(FuelOrigin.FOSSIL, ExternalFuelType.METHANOL, null));
        fuelTypes.add(createExternalAerFuelsAndEmissionsFactors(FuelOrigin.RFNBO, ExternalFuelType.E_METHANOL, null));
        fuelTypes.add(createExternalAerFuelsAndEmissionsFactors(FuelOrigin.BIOFUEL, ExternalFuelType.BIO_METHANOL, null));
        fuelTypes.add(createExternalAerFuelsAndEmissionsFactors(FuelOrigin.BIOFUEL, ExternalFuelType.OTHER, "otherFuelType"));


        return ExternalAerShipEmissions.builder()
            .shipDetails(ExternalAerShipDetails.builder()
                .shipImoNumber("9876543")
                .name("ship details name")
                .shipType(ShipType.BULK)
                .grossTonnage(5000)
                .flag(FlagState.GR)
                .iceClassPolarCode(IceClass.IC)
                .companyNature(ReportingResponsibilityNature.ISM_COMPANY)
                .allYear(true)
                .build())
            .fuelTypes(fuelTypes)
            .emissionsSources(Set.of(
                ExternalAerEmissionsSources.builder()
                    .name("emissions sources name")
                    .emissionSourceTypeCode(EmissionSourceType.AUX_ENGINE)
                    .emissionSourceClassCode(EmissionSourceClass.BOILERS)
                    .fuelTypeCodes(Set.of(
                        createExternalEmpFuelOriginTypeName(FuelOrigin.FOSSIL, ExternalFuelType.METHANOL, null, new BigDecimal("1")),
                        createExternalEmpFuelOriginTypeName(FuelOrigin.RFNBO, ExternalFuelType.E_METHANOL, null, new BigDecimal("3.100")),
                        createExternalEmpFuelOriginTypeName(FuelOrigin.BIOFUEL, ExternalFuelType.BIO_METHANOL, null, new BigDecimal("01.7")),
                        createExternalEmpFuelOriginTypeName(FuelOrigin.BIOFUEL, ExternalFuelType.OTHER, "otherFuelType", new BigDecimal("0"))
                    ))
                    .monitoringMethods(Set.of(MonitoringMethod.BDN))
                    .build()
            ))
            .uncertaintyLevel(Set.of(ExternalEmpUncertaintyLevel.builder()
                .monitoringMethodCode(MonitoringMethod.BDN)
                .levelOfUncertaintyTypeCode(MethodApproach.DEFAULT)
                .shipSpecificUncertainty(new BigDecimal("1"))
                .build()))
            .derogations(ExternalAerDerogations.builder().exceptionFromPerVoyageMonitoring(true).build())
            .build();
    }

    private ExternalEmpFuelOriginTypeName createExternalEmpFuelOriginTypeName(FuelOrigin fossil, ExternalFuelType methanol,
                                                                              String otherFuelType, BigDecimal slipPercentage) {
        return ExternalEmpFuelOriginTypeName.builder()
            .fuelOriginCode(fossil)
            .fuelTypeCode(methanol)
            .otherFuelType(otherFuelType)
            .slipPercentage(slipPercentage)
            .build();
    }

    private FuelOriginFossilTypeName createFuelOriginFossilTypeName() {
        return FuelOriginFossilTypeName.builder()
            .uniqueIdentifier(METHANOL_FUEL_ID)
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.METHANOL)
            .methaneSlipValueType(MethaneSlipValueType.OTHER)
            .methaneSlip(new BigDecimal("1"))
            .build();
    }

    private FuelOriginBiofuelTypeName createFuelOriginBiofuelTypeName(BioFuelType fuelType, String otherFuelType,
                                                                      UUID uuid, BigDecimal slipPercentage) {
        return FuelOriginBiofuelTypeName.builder()
            .uniqueIdentifier(uuid)
            .origin(FuelOrigin.BIOFUEL)
            .type(fuelType)
            .name(otherFuelType)
            .methaneSlipValueType(MethaneSlipValueType.PRESELECTED)
            .methaneSlip(slipPercentage)
            .build();
    }

    private FuelOriginEFuelTypeName createFuelOriginEFuelTypeName() {
        return FuelOriginEFuelTypeName.builder()
            .uniqueIdentifier(E_METHANOL_FUEL_ID)
            .origin(FuelOrigin.RFNBO)
            .type(EFuelType.E_METHANOL)
            .methaneSlipValueType(MethaneSlipValueType.PRESELECTED)
            .methaneSlip(new BigDecimal("3.100"))
            .build();
    }

    private AerFossilFuels createAerFossilFuels() {
        return AerFossilFuels.builder()
            .uniqueIdentifier(METHANOL_FUEL_ID)
            .origin(FuelOrigin.FOSSIL)
            .type(FossilFuelType.METHANOL)
            .carbonDioxide(new BigDecimal("1"))
            .methane(new BigDecimal("2"))
            .nitrousOxide(new BigDecimal("3"))
            .build();
    }

    private AerBioFuels createAerBioFuels(BioFuelType fuelType, String otherFuelType, UUID uuid) {
        return AerBioFuels.builder()
            .uniqueIdentifier(uuid)
            .origin(FuelOrigin.BIOFUEL)
            .type(fuelType)
            .name(otherFuelType)
            .carbonDioxide(new BigDecimal("1"))
            .methane(new BigDecimal("2"))
            .nitrousOxide(new BigDecimal("3"))
            .build();
    }

    private AerEFuels createAerEFuels() {
        return AerEFuels.builder()
            .uniqueIdentifier(E_METHANOL_FUEL_ID)
            .origin(FuelOrigin.RFNBO)
            .type(EFuelType.E_METHANOL)
            .carbonDioxide(new BigDecimal("1"))
            .methane(new BigDecimal("2"))
            .nitrousOxide(new BigDecimal("3"))
            .build();
    }

    private ExternalAerFuelsAndEmissionsFactors createExternalAerFuelsAndEmissionsFactors(FuelOrigin fossil, ExternalFuelType methanol, String otherFuelType) {
        return ExternalAerFuelsAndEmissionsFactors.builder()
            .fuelOriginCode(fossil)
            .fuelTypeCode(methanol)
            .otherFuelType(otherFuelType)
            .ttwEFCarbonDioxide(new BigDecimal("1"))
            .ttwEFMethane(new BigDecimal("2"))
            .ttwEFNitrousOxide(new BigDecimal("3"))
            .build();
    }

    private AerShipEmissions createAerShipEmissions() {
        Set<AerFuelsAndEmissionsFactors> fuelTypes = new LinkedHashSet<>();
        fuelTypes.add(createAerFossilFuels());
        fuelTypes.add(createAerEFuels());
        fuelTypes.add(createAerBioFuels(BioFuelType.BIO_METHANOL, null, BIO_METHANOL_FUEL_ID));
        fuelTypes.add(createAerBioFuels(BioFuelType.OTHER, "otherFuelType", OTHER_FUEL_ID));

        return AerShipEmissions.builder()
            .uniqueIdentifier(AER_SHIP_EMISSIONS_ID)
            .dataSaveMethod(DataSaveMethod.EXTERNAL_PROVIDER)
            .details(AerShipDetails.builder()
                .imoNumber("9876543")
                .name("ship details name")
                .type(ShipType.BULK)
                .grossTonnage(5000)
                .flagState(FlagState.GR)
                .iceClass(IceClass.IC)
                .natureOfReportingResponsibility(ReportingResponsibilityNature.ISM_COMPANY)
                .allYear(true)
                .build())
            .fuelsAndEmissionsFactors(fuelTypes)
            .emissionsSources(Set.of(
                EmissionsSources.builder()
                    .uniqueIdentifier(EMISSION_SOURCE)
                    .name("emissions sources name")
                    .type(EmissionSourceType.AUX_ENGINE)
                    .sourceClass(EmissionSourceClass.BOILERS)
                    .fuelDetails(Set.of(
                        createFuelOriginFossilTypeName(),
                        createFuelOriginEFuelTypeName(),
                        createFuelOriginBiofuelTypeName(BioFuelType.BIO_METHANOL, null, BIO_METHANOL_FUEL_ID, new BigDecimal("01.7")),
                        createFuelOriginBiofuelTypeName(BioFuelType.OTHER, "otherFuelType", OTHER_FUEL_ID, new BigDecimal("0"))
                    ))
                    .monitoringMethod(Set.of(MonitoringMethod.BDN))
                    .build()
            ))
            .uncertaintyLevel(Set.of(UncertaintyLevel.builder()
                .monitoringMethod(MonitoringMethod.BDN)
                .methodApproach(MethodApproach.DEFAULT)
                .value(new BigDecimal("1"))
                .build()))
            .derogations(AerDerogations.builder().exceptionFromPerVoyageMonitoring(true).build())
            .build();
    }
}