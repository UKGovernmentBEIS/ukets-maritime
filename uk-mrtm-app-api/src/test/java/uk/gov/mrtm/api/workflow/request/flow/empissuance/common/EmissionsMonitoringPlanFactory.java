package uk.gov.mrtm.api.workflow.request.flow.empissuance.common;

import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureFormWithFiles;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpControlActivities;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpOutsourcedActivities;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCapture;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCaptureTechnologies;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.exemptionconditions.ExemptionConditions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.measurementdescription.MeasurementDescription;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.MethaneSlipValueType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionCompliance;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionFactors;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpManagementProcedures;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpMonitoringReportingRole;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas.EmpMonitoringGreenhouseGas;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.DeclarationDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.LimitedCompanyOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class EmissionsMonitoringPlanFactory {

    public static EmissionsMonitoringPlan getEmissionsMonitoringPlan(UUID documentId1, String imoNumber) {
        return EmissionsMonitoringPlan.builder()
            .abbreviations(EmpAbbreviations.builder()
                .exist(false)
                .build())
            .additionalDocuments(AdditionalDocuments.builder()
                .exist(true)
                .documents(Set.of(documentId1))
                .build())
            .controlActivities(createControlActivities())
            .managementProcedures(createManagementProcedures(documentId1))
            .operatorDetails(createEmpOperatorDetails(documentId1, imoNumber))
            .dataGaps(createDataGaps())
            .emissions(createEmpEmissions())
            .greenhouseGas(createEmpMonitoringGreenhouseGas())
            .sources(createEmpEmissionSources())
            .build();
    }


    private static EmpEmissions createEmpEmissions() {
        return EmpEmissions.builder()
            .ships(
                Set.of(
                    EmpShipEmissions.builder()
                        .details(
                            ShipDetails.builder()
                                .imoNumber("1231231")
                                .name("name")
                                .type(ShipType.BULK)
                                .grossTonnage(5000)
                                .flagState(FlagState.GR)
                                .iceClass(IceClass.PC1)
                                .natureOfReportingResponsibility(ReportingResponsibilityNature.SHIPOWNER)
                                .build()
                        )
                        .fuelsAndEmissionsFactors(
                            Set.of(EmpBioFuels.builder()
                                .uniqueIdentifier(UUID.randomUUID())
                                .name("name1")
                                .origin(FuelOrigin.FOSSIL)
                                .type(BioFuelType.OTHER)
                                .name("name")
                                .nitrousOxide(new BigDecimal("1"))
                                .carbonDioxide(new BigDecimal("1"))
                                .sustainableFraction(new BigDecimal("1"))
                                .methane(new BigDecimal("1"))
                                .densityMethodBunker(DensityMethodBunker.FUEL_SUPPLIER)
                                .densityMethodTank(DensityMethodTank.MEASUREMENT_SYSTEMS)
                                .build()
                            )
                        )
                        .emissionsSources(
                            Set.of(
                                EmpEmissionsSources.builder()
                                    .uniqueIdentifier(UUID.randomUUID())
                                    .name("emission source name")
                                    .type(EmissionSourceType.GAS_TURBINE)
                                    .sourceClass(EmissionSourceClass.BOILERS)
                                    .monitoringMethod(Set.of(MonitoringMethod.BDN))
                                    .fuelDetails(Set.of(
                                        FuelOriginBiofuelTypeName.builder()
                                            .uniqueIdentifier(UUID.randomUUID())
                                            .methaneSlip(BigDecimal.valueOf(5.5))
                                            .methaneSlipValueType(MethaneSlipValueType.OTHER)
                                            .origin(FuelOrigin.BIOFUEL)
                                            .type(BioFuelType.BIO_LNG)
                                            .build()
                                    ))
                                    .build()
                            )
                        )
                        .carbonCapture(createCarbonCapture())
                        .uniqueIdentifier(UUID.randomUUID())
                        .uncertaintyLevel(Set.of(
                                 UncertaintyLevel.builder()
                                          .monitoringMethod(MonitoringMethod.BDN)
                                          .methodApproach(MethodApproach.DEFAULT)
                                          .value(BigDecimal.valueOf(7.5))
                                          .build()
                            ))
                         .measurements(Set.of(MeasurementDescription.builder()
                                    .name("measurement description name")
                                    .emissionSources(Set.of("emission source name"))
                                    .build()))
                         .exemptionConditions(ExemptionConditions.builder()
                                    .exist(Boolean.FALSE)
                                    .build())
                        .build()
                )
            )
            .build();
    }

    private static EmpControlActivities createControlActivities() {
        return EmpControlActivities.builder()
            .qualityAssurance(createEmpProcedureForm())
            .internalReviews(createEmpProcedureForm())
            .corrections(createEmpProcedureForm())
            .outsourcedActivities(createEmpOutsourcedActivities())
            .documentation(createEmpProcedureForm())
            .build();
    }

    private static EmpManagementProcedures createManagementProcedures(UUID documentId1) {
        return EmpManagementProcedures.builder()
            .monitoringReportingRoles(createEmpMonitoringReportingRoles())
            .dataFlowActivities(createEmpProcedureFormWithFiles(documentId1))
            .riskAssessmentProcedures(createEmpProcedureFormWithFiles(documentId1))
            .regularCheckOfAdequacy(createEmpProcedureForm())
            .build();
    }

    private static EmpDataGaps createDataGaps() {
        return EmpDataGaps.builder()
            .formulaeUsed("Some formulae used")
            .fuelConsumptionEstimationMethod("Some fuel consumption method")
            .responsiblePersonOrPosition("Some responsible person or position")
            .dataSources("Some Data Sources")
            .recordsLocation("Some Records location")
            .itSystemUsed("Some IT System used")
            .build();
    }

    private static EmpProcedureForm createEmpProcedureForm() {
        return EmpProcedureForm.builder()
            .reference("reference")
            .version("version")
            .description("description")
            .responsiblePersonOrPosition("responsiblePersonOrPosition")
            .recordsLocation("recordsLocation")
            .itSystemUsed("itSystemUsed")
            .build();
    }

    private static EmpProcedureFormWithFiles createEmpProcedureFormWithFiles(UUID documentId1) {
        return EmpProcedureFormWithFiles.builder()
            .reference("reference")
            .version("version")
            .description("description")
            .responsiblePersonOrPosition("responsiblePersonOrPosition")
            .recordsLocation("recordsLocation")
            .itSystemUsed("itSystemUsed")
            .files(Set.of(documentId1))
            .build();
    }

    private static EmpOutsourcedActivities createEmpOutsourcedActivities() {
        return EmpOutsourcedActivities.builder()
            .exist(true)
            .details(createEmpProcedureForm())
            .build();
    }

    private static List<EmpMonitoringReportingRole> createEmpMonitoringReportingRoles() {
        EmpMonitoringReportingRole empMonitoringReportingRole = EmpMonitoringReportingRole.builder()
            .jobTitle("empReportingRoleJobTitle")
            .mainDuties("empReportingRoleMainDuties")
            .build();
        return List.of(empMonitoringReportingRole);
    }

    private static EmpOperatorDetails createEmpOperatorDetails(UUID documentId1, String imoNumber) {
        return EmpOperatorDetails.builder()
            .operatorName("testOperatorName")
            .imoNumber(imoNumber)
            .declarationDocuments(DeclarationDocuments.builder()
                .exist(true)
                .documents(Set.of(documentId1))
                .build())
            .contactAddress(AddressStateDTO.builder()
                .line1("line1")
                .city("city")
                .state("state")
                .postcode("postcode")
                .country("GR")
                .build())
            .organisationStructure(LimitedCompanyOrganisation.builder()
                .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                .registrationNumber("testName")
                .evidenceFiles(Set.of(documentId1))
                .registeredAddress(AddressStateDTO.builder()
                    .line1("line1")
                    .city("city")
                    .state("state")
                    .postcode("postcode")
                    .country("GR")
                    .build())
                .build())
            .activityDescription("testActivityDesc")
            .build();
    }

    private static EmpMonitoringGreenhouseGas createEmpMonitoringGreenhouseGas() {
        return EmpMonitoringGreenhouseGas.builder()
            .fuel(createEmpProcedureForm())
            .crossChecks(createEmpProcedureForm())
            .information(createEmpProcedureForm())
            .qaEquipment(createEmpProcedureForm())
            .voyages(createEmpProcedureForm())
            .build();
    }

    private static EmpEmissionSources createEmpEmissionSources() {
        return EmpEmissionSources.builder()
            .listCompletion(createEmpProcedureForm())
            .emissionFactors(EmpEmissionFactors.builder()
                .exist(false)
                .factors(createEmpProcedureForm())
                .build())
            .emissionCompliance(EmpEmissionCompliance.builder()
                .exist(true)
                .criteria(createEmpProcedureForm())
                .build())
            .build();
    }

    private static EmpCarbonCapture createCarbonCapture() {
        return EmpCarbonCapture.builder()
            .exist(true)
            .technologies(
                EmpCarbonCaptureTechnologies.builder()
                    .description("desc")
                    .files(Set.of(UUID.randomUUID()))
                    .technologyEmissionSources(Set.of("emission source name"))
                    .build()
            )
            .build();
    }
}
