package uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.EmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerSave;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedData;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerShipAggregatedDataSave;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissionsSave;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.DataSaveMethod;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfDetails;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchase;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfPurchaseSave;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AerMapper {

    AerEmissions toAerShipEmissions(EmpEmissions emissions);

    default AerFuelsAndEmissionsFactors createAerFuelsAndEmissionsFactors(EmpFuelsAndEmissionsFactors empFuelsAndEmissionsFactors) {
        return switch (empFuelsAndEmissionsFactors) {
            case EmpFossilFuels fossilFuels -> toAerFossilFuels(fossilFuels);
            case EmpEFuels eFuels -> toAerEFuels(eFuels);
            case EmpBioFuels bioFuels -> toAerBioFuels(bioFuels);
            default -> throw new IllegalStateException("Unexpected value: " + empFuelsAndEmissionsFactors);
        };
    }

    @AfterMapping
    default void setAllYearTrue(@MappingTarget AerShipDetails aerShipDetails) {
        aerShipDetails.setAllYear(true);
    }

    AerShipEmissions empShipEmissionsToAerShipEmissions(EmpShipEmissions empShipEmissions);

    @AfterMapping
    default void setDerogations(@MappingTarget AerShipEmissions aerShipEmissions,
                                           EmpShipEmissions empShipEmissions) {
        aerShipEmissions.setDerogations(
            AerDerogations.builder()
                .exceptionFromPerVoyageMonitoring(empShipEmissions.getExemptionConditions().getExist())
                .build()
        );
    }

    // Override this MapStruct method to implement LinkedHashSet instead of HashSet,
    // which will preserve the insertion order of elements.
    default Set<AerFuelsAndEmissionsFactors> empFuelsAndEmissionsFactorsSetToAerFuelsAndEmissionsFactorsSet(
        Set<EmpFuelsAndEmissionsFactors> empFuels) {

        if ( empFuels == null ) {
            return null;
        }

        Set<AerFuelsAndEmissionsFactors> aerFuels = new LinkedHashSet<>();
        for (EmpFuelsAndEmissionsFactors empFuelsAndEmissionsFactors : empFuels) {
            aerFuels.add(createAerFuelsAndEmissionsFactors(empFuelsAndEmissionsFactors));
        }

        return aerFuels;
    }

    AerFossilFuels toAerFossilFuels(EmpFossilFuels source);

    AerEFuels toAerEFuels(EmpEFuels source);

    AerBioFuels toAerBioFuels(EmpBioFuels source);

    EmissionsSources toEmissionsSources(EmpEmissionsSources source);

    @Mapping(target = "smf.smfDetails.attachmentIds", ignore = true)
    @Mapping(target = "smf.attachmentIds", ignore = true)
    Aer toAer(AerSave savePayload, @Context Aer existingAer);

    default Set<AerShipEmissions> aerShipEmissionsSaveSetToAerShipEmissionsSet(Set<AerShipEmissionsSave> saveShips,
                                                                               @Context Aer existingAer) {
        if ( saveShips == null ) {
            return null;
        }

        Map<String, AerShipEmissions> externalShips = Optional.ofNullable(existingAer)
            .map(Aer::getEmissions)
            .map(AerEmissions::getShips)
            .orElse(Collections.emptySet())
            .stream()
            .filter(ship -> ship.getDetails() != null
                && ship.getDetails().getImoNumber() != null
                && DataSaveMethod.EXTERNAL_PROVIDER.equals(ship.getDataSaveMethod()))
            .collect(Collectors.toMap(ship -> ship.getDetails().getImoNumber(), ship -> ship));

        return saveShips.stream()
            .filter(saveShip -> saveShip.getDetails() != null)
            .map(saveShip -> externalShips.getOrDefault(
                saveShip.getDetails().getImoNumber(),
                toAerShipEmissionsSave(saveShip, existingAer)))
            .collect(Collectors.toSet());
    }

    @Mapping(target = "dataSaveMethod", constant = "MANUAL")
    AerShipEmissions toAerShipEmissionsSave(AerShipEmissionsSave aerShipEmissionsSave, @Context Aer existingAer);

    default Set<AerShipAggregatedData> aerShipAggregatedDataSaveSetToAerShipAggregatedDataSet(Set<AerShipAggregatedDataSave> aggregatedData,
                                                                                              @Context Aer existingAer) {
        if ( aggregatedData == null ) {
            return null;
        }

        Map<String, AerShipAggregatedData> externalShips = Optional.ofNullable(existingAer)
            .map(Aer::getAggregatedData)
            .map(AerAggregatedData::getEmissions)
            .orElse(Collections.emptySet())
            .stream()
            .filter(data -> data.getImoNumber() != null
                && DataSaveMethod.EXTERNAL_PROVIDER.equals(data.getDataSaveMethod()))
            .collect(Collectors.toMap(AerShipAggregatedData::getImoNumber, data -> data));

        return aggregatedData.stream()
            .filter(saveShip -> saveShip.getImoNumber() != null)
            .map(data -> externalShips.getOrDefault(
                data.getImoNumber(),
                toAerShipAggregatedDataSave(data, existingAer)))
            .collect(Collectors.toSet());
    }

    @Mapping(target = "dataSaveMethod", constant = "MANUAL")
    AerShipAggregatedData toAerShipAggregatedDataSave(AerShipAggregatedDataSave aerShipAggregatedDataSave, @Context Aer existingAer);

    default List<AerSmfPurchase> aerSmfPurchaseSaveListToAerSmfPurchaseList(List<AerSmfPurchaseSave> aerSmfPurchases,
                                                                            @Context Aer existingAer) {
        if ( aerSmfPurchases == null ) {
            return null;
        }

        Map<UUID, AerSmfPurchase> externalShips = Optional.ofNullable(existingAer)
            .map(Aer::getSmf)
            .map(AerSmf::getSmfDetails)
            .map(AerSmfDetails::getPurchases)
            .orElse(Collections.emptyList())
            .stream()
            .filter(data -> data.getUniqueIdentifier() != null
                && DataSaveMethod.EXTERNAL_PROVIDER.equals(data.getDataSaveMethod()))
            .collect(Collectors.toMap(AerSmfPurchase::getUniqueIdentifier, data -> data));

        return aerSmfPurchases.stream()
            .filter(saveShip -> saveShip.getUniqueIdentifier() != null)
            .map(data -> {
                if (externalShips.containsKey(data.getUniqueIdentifier())) {
                    AerSmfPurchase aerSmfPurchase = externalShips.get(data.getUniqueIdentifier());
                    aerSmfPurchase.setEvidenceFiles(data.getEvidenceFiles());
                    return aerSmfPurchase;
                } else {
                    return toAerSmfPurchaseSave(data, existingAer);
                }
            })
            .collect(Collectors.toList());
    }

    @Mapping(target = "dataSaveMethod", constant = "MANUAL")
    AerSmfPurchase toAerSmfPurchaseSave(AerSmfPurchaseSave aerSmfPurchaseSave, @Context Aer existingAer);

    @Mapping(target = "reportingYear", source = "requestMetadata.year")
    AerContainer toAerContainer(AerRequestPayload requestPayload, AerRequestMetadata requestMetadata);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reportingYear", source = "requestMetadata.year")
    AerApplicationCompletedRequestActionPayload toAerApplicationCompletedRequestActionPayload(AerRequestPayload requestPayload,
                                                                                              String payloadType,
                                                                                              AerRequestMetadata requestMetadata);
}
