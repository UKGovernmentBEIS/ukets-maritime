package uk.gov.mrtm.api.workflow.request.flow.aer.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCapture;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCaptureTechnologies;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
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
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.measurementdescription.MeasurementDescription;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.MethaneSlipValueType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.emissions.AerDerogations;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipDetails;
import uk.gov.mrtm.api.reporting.domain.emissions.AerShipEmissions;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.biofuel.AerBioFuels;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.efuel.AerEFuels;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerFetchShipListHandlerTest {
    private static final UUID UNIQUE_IDENTIFIER = UUID.randomUUID();

    @InjectMocks
    private AerFetchShipListHandler aerFetchShipListHandler;

    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    @Mock
    private RequestTaskService requestTaskService;

    @ParameterizedTest
    @MethodSource("processScenarios")
    void process(boolean exceptionFromPerVoyageMonitoring, boolean carbonCaptureAndStorageReduction) {
        Long requestTaskId = 1L;
        Long accountId = 100L;
        AppUser appUser = AppUser.builder().build();

        RequestTaskActionEmptyPayload taskActionPayload =
                RequestTaskActionEmptyPayload.builder()
                        .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                        .build();

        String processTaskId = "processTaskId";
        Request request = Request.builder().id("1").requestResources(List.of(RequestResource.builder()
                .resourceId("100").resourceType(ResourceType.ACCOUNT).build())).build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .emissions(createEmpEmissions(exceptionFromPerVoyageMonitoring, carbonCaptureAndStorageReduction))
            .build();

        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan).build();

        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId))
                .thenReturn(Optional.ofNullable(
                        EmissionsMonitoringPlanDTO
                                .builder()
                                .empContainer(empContainer)
                                .build())
                );

        AerEmissions aerEmissions = createAerEmissions(exceptionFromPerVoyageMonitoring, carbonCaptureAndStorageReduction);

        AerApplicationSubmitRequestTaskPayload expectedTaskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .aer(Aer.builder().emissions(aerEmissions).build())
            .build();

        RequestTask requestTask = RequestTask.builder()
            .payload(AerApplicationSubmitRequestTaskPayload.builder().aer(Aer.builder().build()).build())
            .id(requestTaskId)
            .request(request).processTaskId(processTaskId)
            .build();
        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload actualTaskPayload = aerFetchShipListHandler.process(requestTaskId, MrtmRequestTaskActionType.AER_FETCH_EMP_LIST_OF_SHIPS,
            appUser, taskActionPayload);

        assertThat(actualTaskPayload).isEqualTo(expectedTaskPayload);
    }

    public static Stream<Arguments> processScenarios() {
        return Stream.of(
            Arguments.of(true, true),
            Arguments.of(true, false),
            Arguments.of(false, true),
            Arguments.of(false, false)
        );
    }

    @Test
    void getTypes() {
        assertThat(aerFetchShipListHandler.getTypes()).containsOnly(MrtmRequestTaskActionType.AER_FETCH_EMP_LIST_OF_SHIPS);
    }

    private AerEmissions createAerEmissions(boolean exceptionFromPerVoyageMonitoring,
                                            boolean carbonCaptureAndStorageReduction) {
        return AerEmissions.builder()
            .ships(Set.of(AerShipEmissions.builder()
                .details(
                    AerShipDetails.builder()
                        .imoNumber("1231231")
                        .name("name")
                        .type(ShipType.BULK)
                        .grossTonnage(5000)
                        .flagState(FlagState.GR)
                        .iceClass(IceClass.PC1)
                        .allYear(true)
                        .natureOfReportingResponsibility(ReportingResponsibilityNature.SHIPOWNER)
                        .build()
                )
                .emissionsSources(
                    Set.of(
                        EmissionsSources.builder()
                            .uniqueIdentifier(UNIQUE_IDENTIFIER)
                            .name("emission source name")
                            .type(EmissionSourceType.GAS_TURBINE)
                            .sourceClass(EmissionSourceClass.BOILERS)
                            .monitoringMethod(Set.of(MonitoringMethod.BDN))
                            .fuelDetails(Set.of(
                                FuelOriginBiofuelTypeName.builder()
                                    .uniqueIdentifier(UNIQUE_IDENTIFIER)
                                    .methaneSlip(BigDecimal.valueOf(5.5))
                                    .methaneSlipValueType(MethaneSlipValueType.OTHER)
                                    .origin(FuelOrigin.BIOFUEL)
                                    .type(BioFuelType.OTHER)
                                    .name("name")
                                    .build()
                            ))
                            .build()
                    )
                )
                .fuelsAndEmissionsFactors(
                    Set.of(
                        AerBioFuels.builder()
                            .uniqueIdentifier(UNIQUE_IDENTIFIER)
                            .name("name1")
                            .origin(FuelOrigin.FOSSIL)
                            .type(BioFuelType.OTHER)
                            .name("name1")
                            .nitrousOxide(new BigDecimal("1"))
                            .carbonDioxide(new BigDecimal("1"))
                            .sustainableFraction(new BigDecimal("1"))
                            .methane(new BigDecimal("1"))
                            .build(),
                        AerEFuels.builder()
                            .uniqueIdentifier(UNIQUE_IDENTIFIER)
                            .name("name2")
                            .origin(FuelOrigin.RFNBO)
                            .type(EFuelType.OTHER)
                            .name("name2")
                            .nitrousOxide(new BigDecimal("2"))
                            .carbonDioxide(new BigDecimal("2"))
                            .sustainableFraction(new BigDecimal("2"))
                            .methane(new BigDecimal("2"))
                            .build()
                    )
                )
                .uniqueIdentifier(UNIQUE_IDENTIFIER)
                .uncertaintyLevel(Set.of(
                    UncertaintyLevel.builder()
                        .monitoringMethod(MonitoringMethod.BDN)
                        .methodApproach(MethodApproach.DEFAULT)
                        .value(BigDecimal.valueOf(7.5))
                        .build()
                ))
                .derogations(
                    AerDerogations.builder()
                        .carbonCaptureAndStorageReduction(carbonCaptureAndStorageReduction)
                        .exceptionFromPerVoyageMonitoring(exceptionFromPerVoyageMonitoring)
                        .build()
                )
                .build()))
            .build();
    }

    private EmpEmissions createEmpEmissions(boolean exceptionFromPerVoyageMonitoring,
                                            boolean carbonCaptureAndStorageReduction) {
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
                                    .uniqueIdentifier(UNIQUE_IDENTIFIER)
                                    .name("name1")
                                    .origin(FuelOrigin.FOSSIL)
                                    .type(BioFuelType.OTHER)
                                    .name("name1")
                                    .nitrousOxide(new BigDecimal("1"))
                                    .carbonDioxide(new BigDecimal("1"))
                                    .sustainableFraction(new BigDecimal("1"))
                                    .methane(new BigDecimal("1"))
                                    .densityMethodBunker(DensityMethodBunker.FUEL_SUPPLIER)
                                    .densityMethodTank(DensityMethodTank.MEASUREMENT_SYSTEMS)
                                    .build(),
                                EmpEFuels.builder()
                                    .uniqueIdentifier(UNIQUE_IDENTIFIER)
                                    .name("name2")
                                    .origin(FuelOrigin.RFNBO)
                                    .type(EFuelType.OTHER)
                                    .name("name2")
                                    .nitrousOxide(new BigDecimal("2"))
                                    .carbonDioxide(new BigDecimal("2"))
                                    .sustainableFraction(new BigDecimal("2"))
                                    .methane(new BigDecimal("2"))
                                    .build()
                            )
                        )
                        .emissionsSources(
                            Set.of(
                                EmpEmissionsSources.builder()
                                    .uniqueIdentifier(UNIQUE_IDENTIFIER)
                                    .name("emission source name")
                                    .type(EmissionSourceType.GAS_TURBINE)
                                    .sourceClass(EmissionSourceClass.BOILERS)
                                    .monitoringMethod(Set.of(MonitoringMethod.BDN))
                                    .fuelDetails(Set.of(
                                        FuelOriginBiofuelTypeName.builder()
                                            .uniqueIdentifier(UNIQUE_IDENTIFIER)
                                            .methaneSlip(BigDecimal.valueOf(5.5))
                                            .origin(FuelOrigin.BIOFUEL)
                                            .methaneSlipValueType(MethaneSlipValueType.OTHER)
                                            .type(BioFuelType.OTHER)
                                            .name("name")
                                            .build()
                                    ))
                                    .build()
                            )
                        )
                        .carbonCapture(createCarbonCapture(carbonCaptureAndStorageReduction))
                        .uniqueIdentifier(UNIQUE_IDENTIFIER)
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
                            .exist(exceptionFromPerVoyageMonitoring)
                            .build())
                        .build()
                )
            )
            .build();
    }

    private EmpCarbonCapture createCarbonCapture(boolean carbonCaptureAndStorageReduction) {
        return EmpCarbonCapture.builder()
            .exist(carbonCaptureAndStorageReduction)
            .technologies(
                EmpCarbonCaptureTechnologies.builder()
                    .description("desc")
                    .files(Set.of(UNIQUE_IDENTIFIER))
                    .technologyEmissionSources(Set.of("emission source name"))
                    .build()
            )
            .build();
    }
}