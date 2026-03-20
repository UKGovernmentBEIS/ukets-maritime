package uk.gov.mrtm.api.integration.external.emp.transform;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureFormWithFiles;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpControlActivities;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpOutsourcedActivities;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCapture;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCaptureTechnologies;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.exemptionconditions.ExemptionConditions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.EmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.measurementdescription.MeasurementDescription;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionCompliance;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpManagementProcedures;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.EmpMandate;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.EmpRegisteredOwner;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.mandate.RegisteredOwnerShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas.EmpMonitoringGreenhouseGas;
import uk.gov.mrtm.api.integration.external.common.MrtmStagingPayloadType;
import uk.gov.mrtm.api.integration.external.common.mapper.ExternalCommonMapper;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.datagaps.ExternalEmpDataGaps;
import uk.gov.mrtm.api.integration.external.emp.domain.delegatedresponsibility.ExternalEmpDelegatedResponsibility;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpControlActivitiesProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpEmissionsProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpFuelConsumptionProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpManagementProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpProcedureForm;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpEmissionsSources;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpMeasurementDescription;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpShipEmissions;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ExternalEmpMapper extends ExternalCommonMapper {

    public StagingEmissionsMonitoringPlan toStagingEmissionsMonitoringPlan(ExternalEmissionsMonitoringPlan external) {

        EmpMandate empMandate = toEmpMandate(external.getDelegatedResponsibility());
        EmpMonitoringGreenhouseGas greenhouseGas = toEmpMonitoringGreenhouseGas(external.getProcedures().getFuelConsumptionProcedures());
        EmpManagementProcedures managementProcedures = toEmpManagementProcedures(external.getProcedures().getManagementProcedures());
        EmpControlActivities controlActivities = toEmpControlActivities(external.getProcedures().getControlActivitiesProcedures());
        EmpDataGaps dataGaps = toEmpDataGaps(external.getDataGaps());
        EmpEmissionSources sources = toEmpEmissionSources(external.getProcedures().getEmissionsProcedures());
        EmpEmissions emissions = toEmpEmissions(external.getShipParticulars());

        return StagingEmissionsMonitoringPlan.builder()
            .payloadType(MrtmStagingPayloadType.EMP_STAGING_PAYLOAD)
            .mandate(empMandate)
            .greenhouseGas(greenhouseGas)
            .managementProcedures(managementProcedures)
            .controlActivities(controlActivities)
            .dataGaps(dataGaps)
            .sources(sources)
            .emissions(emissions)
            .build();
    }

    private EmpMandate toEmpMandate(ExternalEmpDelegatedResponsibility delegatedResponsibility) {

        Set<EmpRegisteredOwner> registeredOwners = new HashSet<>();
        Boolean delegatedResponsibilityUsed = delegatedResponsibility.getDelegatedResponsibilityUsed();

        if (delegatedResponsibilityUsed) {
            registeredOwners = delegatedResponsibility.getRegisteredOwners().stream().map(
                registeredOwner -> EmpRegisteredOwner.builder()
                    .uniqueIdentifier(UUID.randomUUID())
                    .name(registeredOwner.getName())
                    .imoNumber(registeredOwner.getCompanyImoNumber())
                    .contactName(registeredOwner.getContactName())
                    .email(registeredOwner.getEmail())
                    .effectiveDate(registeredOwner.getAgreementDate())
                    .ships(registeredOwner.getShips().stream().map(
                        ship -> RegisteredOwnerShipDetails.builder()
                            .name(ship.getName())
                            .imoNumber(ship.getShipImoNumber())
                            .build()
                    ).collect(Collectors.toSet()))
                    .build()
            ).collect(Collectors.toSet());
        }

        return EmpMandate.builder()
            .exist(delegatedResponsibilityUsed)
            .responsibilityDeclaration(delegatedResponsibility.getResponsibilityDeclaration())
            .registeredOwners(registeredOwners)
            .build();
    }

    private EmpMonitoringGreenhouseGas toEmpMonitoringGreenhouseGas(ExternalEmpFuelConsumptionProcedures greenhouseGas) {
        return EmpMonitoringGreenhouseGas.builder()
            .fuel(toEmpProcedureForm(greenhouseGas.getFuelBunkeredAndInTanksProcedure()))
            .crossChecks(toEmpProcedureForm(greenhouseGas.getBunkeringCrossChecksProcedure()))
            .information(toEmpProcedureForm(greenhouseGas.getInformationManagementProcedure()))
            .qaEquipment(toEmpProcedureForm(greenhouseGas.getEquipmentQualityAssuranceProcedure()))
            .voyages(toEmpProcedureForm(greenhouseGas.getVoyagesCompletenessProcedure()))
            .build();
    }

    private EmpManagementProcedures toEmpManagementProcedures(ExternalEmpManagementProcedures managementProcedures) {
        return EmpManagementProcedures.builder()
            .monitoringReportingRoles(managementProcedures.getMonitoringReportingRoles())
            .regularCheckOfAdequacy(toEmpProcedureForm(managementProcedures.getAdequacyCheckProcedure()))
            .dataFlowActivities(toEmpProcedureFormWithFiles(managementProcedures.getDataFlowActivitiesProcedure()))
            .riskAssessmentProcedures(toEmpProcedureFormWithFiles(managementProcedures.getRiskAssessmentProcedure()))
            .build();
    }

    private EmpControlActivities toEmpControlActivities(ExternalEmpControlActivitiesProcedures controlActivities) {
        EmpProcedureForm details = null;
        Boolean activitiesExists = controlActivities.getOutsourcedActivitiesProcedure().getOutsourcedActivitiesExists();

        if (activitiesExists) {
            details = toEmpProcedureForm(controlActivities.getOutsourcedActivitiesProcedure().getDetails());
        }

        return EmpControlActivities.builder()
            .qualityAssurance(toEmpProcedureForm(controlActivities.getQaItProcedure()))
            .internalReviews(toEmpProcedureForm(controlActivities.getDataReviewProcedure()))
            .corrections(toEmpProcedureForm(controlActivities.getCorrectionsProcedure()))
            .outsourcedActivities(EmpOutsourcedActivities.builder()
                .exist(activitiesExists)
                .details(details)
                .build())
            .documentation(toEmpProcedureForm(controlActivities.getDocumentationProcedure()))
            .build();
    }

    private EmpDataGaps toEmpDataGaps(ExternalEmpDataGaps dataGaps) {
        return EmpDataGaps.builder()
            .formulaeUsed(dataGaps.getFormulaeUsed())
            .fuelConsumptionEstimationMethod(dataGaps.getFuelConsumptionEstimationMethod())
            .responsiblePersonOrPosition(dataGaps.getResponsiblePerson())
            .dataSources(dataGaps.getDataSources())
            .recordsLocation(dataGaps.getLocationOfRecords())
            .itSystemUsed(dataGaps.getItSystem())
            .build();
    }

    private EmpEmissionSources toEmpEmissionSources(ExternalEmpEmissionsProcedures emissionsProcedures) {
        Boolean defaultFactorsUsed = emissionsProcedures.getEmissionFactorsProcedure().getDefaultFactorsUsed();
        EmpProcedureForm factors = null;
        if (!defaultFactorsUsed) {
            factors = toEmpProcedureForm(emissionsProcedures.getEmissionFactorsProcedure().getEmissionFactorsProcedureDetails());
        }

        Boolean emissionsReductionClaimExists = emissionsProcedures.getReductionClaimProcedure().getEmissionsReductionClaimExists();
        EmpProcedureForm criteria = null;
        if (emissionsReductionClaimExists) {
            criteria = toEmpProcedureForm(emissionsProcedures.getReductionClaimProcedure().getReductionClaimProcedureDetails());
        }

        return EmpEmissionSources.builder()
            .listCompletion(toEmpProcedureForm(emissionsProcedures.getEmissionSourcesProcedure()))
            .emissionFactors(EmpEmissionFactors.builder()
                .exist(defaultFactorsUsed)
                .factors(factors)
                .build())
            .emissionCompliance(EmpEmissionCompliance.builder()
                .exist(emissionsReductionClaimExists)
                .criteria(criteria)
                .build())
            .build();
    }

    private EmpEmissions toEmpEmissions(Set<ExternalEmpShipEmissions> shipParticulars) {
        return EmpEmissions.builder()
            .ships(shipParticulars.stream().map(
                ship -> {

                    ship.getFuelTypes().forEach(fuel -> createFuelTypeUuids(fuel.getFuelTypeCode(), fuel.getOtherFuelType()));

                    Set<EmpFuelsAndEmissionsFactors> fuelsAndEmissionsFactors =
                        ship.getFuelTypes().stream()
                            .map(this::toFuelsAndEmissionsFactors)
                            .collect(Collectors.toSet());

                    Set<EmpEmissionsSources> emissionsSources = ship.getEmissionsSources().stream()
                            .map(this::toEmpEmissionsSources)
                        .collect(Collectors.toSet());

                    return EmpShipEmissions.builder()
                        .uniqueIdentifier(UUID.randomUUID())
                        .details(toShipDetails(ship))
                        .fuelsAndEmissionsFactors(fuelsAndEmissionsFactors)
                        .emissionsSources(emissionsSources)
                        .uncertaintyLevel(ship.getUncertaintyLevel().stream().map(
                            this::toUncertaintyLevel).collect(Collectors.toSet()))
                        .carbonCapture(toEmpCarbonCapture(ship))
                        .measurements(ship.getMeasuringEquipment().stream().map(this::toMeasurementDescription).collect(Collectors.toSet()))
                        .exemptionConditions(toExemptionConditions(ship))
                        .build();
                }
            ).collect(Collectors.toSet()))
            .build();
    }

    private EmpEmissionsSources toEmpEmissionsSources(ExternalEmpEmissionsSources emissionsSources) {
        return EmpEmissionsSources.builder()
            .name(emissionsSources.getName())
            .type(emissionsSources.getEmissionSourceTypeCode())
            .sourceClass(emissionsSources.getEmissionSourceClassCode())
            .fuelDetails(emissionsSources.getFuelTypeCodes().stream()
                .map(this::toFuelOriginTypeName).collect(Collectors.toSet()))
            .monitoringMethod(emissionsSources.getMonitoringMethods())
            .referenceNumber(emissionsSources.getIdentificationNumber())
            .uniqueIdentifier(UUID.randomUUID())
            .build();
    }


    private EmpFuelsAndEmissionsFactors toFuelsAndEmissionsFactors(ExternalEmpFuelsAndEmissionsFactors fuelFactor) {
        UUID fuelTypeUuid = getFuelTypeUuids(fuelFactor.getFuelTypeCode(),
            fuelFactor.getOtherFuelType());

        return switch (fuelFactor.getFuelOriginCode()) {
            case FuelOrigin.BIOFUEL -> EmpBioFuels.builder()
                .uniqueIdentifier(fuelTypeUuid)
                .origin(fuelFactor.getFuelOriginCode())
                .type(BioFuelType.valueOf(fuelFactor.getFuelTypeCode().name()))
                .name(fuelFactor.getOtherFuelType())
                .carbonDioxide(fuelFactor.getTtwEFCarbonDioxide())
                .methane(fuelFactor.getTtwEFMethane())
                .nitrousOxide(fuelFactor.getTtwEFNitrousOxide())
                .densityMethodBunker(fuelFactor.getMethodDensityBunkerCode())
                .densityMethodTank(fuelFactor.getMethodDensityTankCode())
                .build();
            case FuelOrigin.RFNBO -> EmpEFuels.builder()
                .uniqueIdentifier(fuelTypeUuid)
                .origin(fuelFactor.getFuelOriginCode())
                .type(EFuelType.valueOf(fuelFactor.getFuelTypeCode().name()))
                .name(fuelFactor.getOtherFuelType())
                .carbonDioxide(fuelFactor.getTtwEFCarbonDioxide())
                .methane(fuelFactor.getTtwEFMethane())
                .nitrousOxide(fuelFactor.getTtwEFNitrousOxide())
                .densityMethodBunker(fuelFactor.getMethodDensityBunkerCode())
                .densityMethodTank(fuelFactor.getMethodDensityTankCode())
                .build();
            case FuelOrigin.FOSSIL -> EmpFossilFuels.builder()
                .uniqueIdentifier(fuelTypeUuid)
                .origin(fuelFactor.getFuelOriginCode())
                .type(FossilFuelType.valueOf(fuelFactor.getFuelTypeCode().name()))
                .name(fuelFactor.getOtherFuelType())
                .carbonDioxide(fuelFactor.getTtwEFCarbonDioxide())
                .methane(fuelFactor.getTtwEFMethane())
                .nitrousOxide(fuelFactor.getTtwEFNitrousOxide())
                .densityMethodBunker(fuelFactor.getMethodDensityBunkerCode())
                .densityMethodTank(fuelFactor.getMethodDensityTankCode())
                .build();
        };
    }

    private ExemptionConditions toExemptionConditions(ExternalEmpShipEmissions ship) {
        return ExemptionConditions.builder()
            .exist(ship.getConditionsOfExemption().getDerogationCodeUsed())
            .minVoyages(ship.getConditionsOfExemption().getMinimumNumberOfVoyages())
            .build();
    }

    private MeasurementDescription toMeasurementDescription(ExternalEmpMeasurementDescription equipment) {
        return MeasurementDescription.builder()
            .name(equipment.getName())
            .technicalDescription(equipment.getTechnicalDescription())
            .emissionSources(equipment.getEmissionSourceName())
            .build();
    }

    private EmpCarbonCapture toEmpCarbonCapture(ExternalEmpShipEmissions ship) {
        EmpCarbonCaptureTechnologies technologies = null;

        Boolean captureAndStorageApplied = ship.getCcsCcu().getCaptureAndStorageApplied();
        if (captureAndStorageApplied) {
            technologies = EmpCarbonCaptureTechnologies.builder()
                .description(ship.getCcsCcu().getTechnology())
                .technologyEmissionSources(ship.getCcsCcu().getEmissionSourceName())
                .build();
        }

        return EmpCarbonCapture.builder()
            .exist(captureAndStorageApplied)
            .technologies(technologies)
            .build();
    }

    private ShipDetails toShipDetails(ExternalEmpShipEmissions ship) {
        return ShipDetails.builder()
            .imoNumber(ship.getShipDetails().getShipImoNumber())
            .name(ship.getShipDetails().getName())
            .type(ship.getShipDetails().getShipType())
            .grossTonnage(ship.getShipDetails().getGrossTonnage())
            .flagState(ship.getShipDetails().getFlag())
            .iceClass(ship.getShipDetails().getIceClassPolarCode())
            .natureOfReportingResponsibility(ship.getShipDetails().getCompanyNature())
            .build();
    }

    private EmpProcedureForm toEmpProcedureForm(ExternalEmpProcedureForm empProcedureForm) {
        return EmpProcedureForm.builder()
            .reference(empProcedureForm.getReferenceExistingProcedure())
            .version(empProcedureForm.getVersionExistingProcedure())
            .description(empProcedureForm.getDescription())
            .responsiblePersonOrPosition(empProcedureForm.getResponsiblePerson())
            .recordsLocation(empProcedureForm.getLocationOfRecords())
            .itSystemUsed(empProcedureForm.getItSystem())
            .build();
    }

    private EmpProcedureFormWithFiles toEmpProcedureFormWithFiles(ExternalEmpProcedureForm empProcedureForm) {
        return EmpProcedureFormWithFiles.builder()
            .reference(empProcedureForm.getReferenceExistingProcedure())
            .version(empProcedureForm.getVersionExistingProcedure())
            .description(empProcedureForm.getDescription())
            .responsiblePersonOrPosition(empProcedureForm.getResponsiblePerson())
            .recordsLocation(empProcedureForm.getLocationOfRecords())
            .itSystemUsed(empProcedureForm.getItSystem())
            .build();
    }
}
