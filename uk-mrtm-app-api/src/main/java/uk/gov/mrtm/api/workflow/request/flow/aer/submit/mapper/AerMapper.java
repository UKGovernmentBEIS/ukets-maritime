package uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.EmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerSave;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil.AerFossilFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;

import java.util.LinkedHashSet;
import java.util.Set;

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

    @Mapping(target = "allYear", expression = "java(true)")
    AerShipDetails shipDetailsToAerShipDetails(ShipDetails shipDetails);

    AerShipEmissions empShipEmissionsToAerShipEmissions(EmpShipEmissions empShipEmissions);

    @AfterMapping
    default void setDerogations(@MappingTarget AerShipEmissions aerShipEmissions,
                                           EmpShipEmissions empShipEmissions) {
        aerShipEmissions.setDerogations(
            AerDerogations.builder()
                .carbonCaptureAndStorageReduction(empShipEmissions.getCarbonCapture().getExist())
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
    Aer toAer(AerSave savePayload);

    @Mapping(target = "reportingYear", source = "requestMetadata.year")
    AerContainer toAerContainer(AerRequestPayload requestPayload, AerRequestMetadata requestMetadata);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reportingYear", source = "requestMetadata.year")
    AerApplicationCompletedRequestActionPayload toAerApplicationCompletedRequestActionPayload(AerRequestPayload requestPayload,
                                                                                              String payloadType,
                                                                                              AerRequestMetadata requestMetadata);
}
