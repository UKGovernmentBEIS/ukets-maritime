package uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataFuelOriginTypeName;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedDataSave;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissionsSave;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.DataInputType;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.DataInputTypeSave;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfDetails;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchaseSave;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class AerMapperTest {

    private final AerMapper mapper = Mappers.getMapper(AerMapper.class);

    @Test
    void aerShipEmissionsSaveSetToAerShipEmissionsSet() {
        AerShipEmissionsSave shipToSave1 = createAerShipEmissionsSave("1");
        AerShipEmissionsSave shipToSave2 = createAerShipEmissionsSave("2");
        AerShipEmissionsSave shipToSave4 = createAerShipEmissionsSave("4");

        Set<AerShipEmissionsSave> shipsToSave = Set.of(shipToSave1, shipToSave2, shipToSave4);

        AerShipEmissions savedShip1 = createAerShipEmissions("1");
        AerShipEmissions savedShip3 = createAerShipEmissions("3");
        AerShipEmissions savedShip2 = AerShipEmissions.builder()
            .dataInputType(DataInputType.MANUAL)
            .details(shipToSave2.getDetails())
            .uniqueIdentifier(shipToSave2.getUniqueIdentifier())
            .fuelsAndEmissionsFactors(shipToSave2.getFuelsAndEmissionsFactors())
            .emissionsSources(shipToSave2.getEmissionsSources())
            .uncertaintyLevel(shipToSave2.getUncertaintyLevel())
            .derogations(shipToSave2.getDerogations())
            .build();
        AerShipEmissions savedShip4 = AerShipEmissions.builder()
            .dataInputType(DataInputType.FETCH_FROM_EMP)
            .details(shipToSave4.getDetails())
            .uniqueIdentifier(shipToSave4.getUniqueIdentifier())
            .fuelsAndEmissionsFactors(shipToSave4.getFuelsAndEmissionsFactors())
            .emissionsSources(shipToSave4.getEmissionsSources())
            .uncertaintyLevel(shipToSave4.getUncertaintyLevel())
            .derogations(shipToSave4.getDerogations())
            .build();

        Set<AerShipEmissions> savedShips = Set.of(savedShip1, savedShip3, savedShip4);

        Set<AerShipEmissions> expectedShips = Set.of(savedShip1, savedShip2, savedShip4);

        Aer existingAer = Aer.builder().emissions(AerEmissions.builder().ships(savedShips).build()).build();
        Set<AerShipEmissions> actualShips = mapper.aerShipEmissionsSaveSetToAerShipEmissionsSet(shipsToSave, existingAer);

        assertEquals(expectedShips, actualShips);
    }

    @Test
    void aerShipAggregatedDataSaveSetToAerShipAggregatedDataSet() {
        AerShipAggregatedDataSave dataToSave1 = createAerShipAggregatedDataSave("1");
        AerShipAggregatedDataSave dataToSave2 = createAerShipAggregatedDataSave("2");

        Set<AerShipAggregatedDataSave> dataToSave = Set.of(dataToSave1, dataToSave2);

        AerShipAggregatedData savedData1 = createAerShipAggregatedData("1");
        AerShipAggregatedData savedData3 = createAerShipAggregatedData("3");
        AerShipAggregatedData savedData2 = AerShipAggregatedData.builder()
            .dataInputType(DataInputType.MANUAL)
            .uniqueIdentifier(dataToSave2.getUniqueIdentifier())
            .isFromFetch(dataToSave2.isFromFetch())
            .imoNumber(dataToSave2.getImoNumber())
            .fuelConsumptions(dataToSave2.getFuelConsumptions())
            .build();

        Set<AerShipAggregatedData> savedData = Set.of(savedData1, savedData3);

        Set<AerShipAggregatedData> expectedData = Set.of(savedData2, savedData1);

        Aer existingAer = Aer.builder().aggregatedData(AerAggregatedData.builder().emissions(savedData).build()).build();
        Set<AerShipAggregatedData> actualShips = mapper.aerShipAggregatedDataSaveSetToAerShipAggregatedDataSet(dataToSave, existingAer);

        assertEquals(expectedData, actualShips);
    }

    @Test
    void aerSmfPurchaseSaveListToAerSmfPurchaseList() {
        UUID id1 = UUID.randomUUID();
        UUID id2 = UUID.randomUUID();
        UUID id3 = UUID.randomUUID();

        AerSmfPurchaseSave dataToSave1 = createAerSmfPurchaseSave(id1);
        AerSmfPurchaseSave dataToSave2 = createAerSmfPurchaseSave(id2);

        List<AerSmfPurchaseSave> dataToSave = List.of(dataToSave1, dataToSave2);

        AerSmfPurchase savedData1 = createAerSmfPurchase(id1);
        AerSmfPurchase savedData3 = createAerSmfPurchase(id3);
        AerSmfPurchase savedData2 = AerSmfPurchase.builder()
            .dataInputType(DataInputType.MANUAL)
            .fuelOriginTypeName(dataToSave2.getFuelOriginTypeName())
            .batchNumber(dataToSave2.getBatchNumber())
            .smfMass(dataToSave2.getSmfMass())
            .co2EmissionFactor(dataToSave2.getCo2EmissionFactor())
            .evidenceFiles(dataToSave2.getEvidenceFiles())
            .uniqueIdentifier(id2)
            .build();

        List<AerSmfPurchase> savedData = List.of(savedData1, savedData3);

        List<AerSmfPurchase> expectedData = List.of(savedData1, savedData2);

        Aer existingAer = Aer.builder().smf(AerSmf.builder().smfDetails(AerSmfDetails.builder().purchases(savedData).build()).build()).build();
        List<AerSmfPurchase> actualShips = mapper.aerSmfPurchaseSaveListToAerSmfPurchaseList(dataToSave, existingAer);

        assertEquals(expectedData, actualShips);
    }

    private AerSmfPurchase createAerSmfPurchase(UUID uniqueIdentifier) {
        return AerSmfPurchase.builder()
            .dataInputType(DataInputType.EXTERNAL_PROVIDER)
            .fuelOriginTypeName(mock(AerAggregatedDataFuelOriginTypeName.class))
            .batchNumber("batchNumber" + uniqueIdentifier)
            .smfMass(mock(BigDecimal.class))
            .co2EmissionFactor(mock(BigDecimal.class))
            .evidenceFiles(Set.of(mock(UUID.class)))
            .uniqueIdentifier(uniqueIdentifier)
            .build();
    }

    private AerSmfPurchaseSave createAerSmfPurchaseSave(UUID uniqueIdentifier) {
        return AerSmfPurchaseSave.builder()
            .fuelOriginTypeName(mock(AerAggregatedDataFuelOriginTypeName.class))
            .batchNumber("batchNumber" + uniqueIdentifier)
            .dataInputType(DataInputTypeSave.MANUAL)
            .smfMass(mock(BigDecimal.class))
            .co2EmissionFactor(mock(BigDecimal.class))
            .evidenceFiles(Set.of(mock(UUID.class)))
            .uniqueIdentifier(uniqueIdentifier)
            .build();
    }

    private AerShipAggregatedData createAerShipAggregatedData(String imoNumber) {
        return AerShipAggregatedData.builder()
            .dataInputType(DataInputType.EXTERNAL_PROVIDER)
            .uniqueIdentifier(mock(UUID.class))
            .isFromFetch(true)
            .imoNumber(imoNumber)
            .fuelConsumptions(Set.of(mock(AerAggregatedDataFuelConsumption.class)))
            .emissionsWithinUKPorts(mock(AerPortEmissionsMeasurement.class))
            .emissionsBetweenUKPorts(mock(AerPortEmissionsMeasurement.class))
            .emissionsBetweenUKAndNIVoyages(mock(AerPortEmissionsMeasurement.class))
            .totalEmissionsFromVoyagesAndPorts(mock(AerPortEmissionsMeasurement.class))
            .lessVoyagesInNorthernIrelandDeduction(mock(AerPortEmissionsMeasurement.class))
            .totalShipEmissions(mock(BigDecimal.class))
            .surrenderEmissions(mock(BigDecimal.class))
            .build();
    }

    private AerShipAggregatedDataSave createAerShipAggregatedDataSave(String imoNumber) {
        return AerShipAggregatedDataSave.builder()
            .uniqueIdentifier(mock(UUID.class))
            .isFromFetch(true)
            .imoNumber(imoNumber)
            .dataInputType(DataInputTypeSave.MANUAL)
            .fuelConsumptions(Set.of(mock(AerAggregatedDataFuelConsumption.class)))
            .build();
    }

    private AerShipEmissionsSave createAerShipEmissionsSave(String imoNumber) {
        return AerShipEmissionsSave.builder()
            .details(AerShipDetails.builder().imoNumber(imoNumber).build())
            .uniqueIdentifier(mock(UUID.class))
            .dataInputType(DataInputTypeSave.MANUAL)
            .fuelsAndEmissionsFactors(Set.of(mock(AerFuelsAndEmissionsFactors.class)))
            .emissionsSources(Set.of(mock(EmissionsSources.class)))
            .uncertaintyLevel(Set.of(mock(UncertaintyLevel.class)))
            .derogations(mock(AerDerogations.class))
            .build();
    }

    private AerShipEmissions createAerShipEmissions(String imoNumber) {
        return AerShipEmissions.builder()
            .dataInputType(DataInputType.EXTERNAL_PROVIDER)
            .details(AerShipDetails.builder().imoNumber(imoNumber).build())
            .uniqueIdentifier(mock(UUID.class))
            .fuelsAndEmissionsFactors(Set.of(mock(AerFuelsAndEmissionsFactors.class)))
            .emissionsSources(Set.of(mock(EmissionsSources.class)))
            .uncertaintyLevel(Set.of(mock(UncertaintyLevel.class)))
            .derogations(mock(AerDerogations.class))
            .build();
    }
}