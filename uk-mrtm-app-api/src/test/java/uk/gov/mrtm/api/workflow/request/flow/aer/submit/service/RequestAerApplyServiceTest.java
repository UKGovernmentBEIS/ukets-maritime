package uk.gov.mrtm.api.workflow.request.flow.aer.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.aer.repository.StagingAerRepository;
import uk.gov.mrtm.api.integration.external.common.domain.StagingImportStatus;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerMonitoringPlanChanges;
import uk.gov.mrtm.api.reporting.domain.AerOperatorDetails;
import uk.gov.mrtm.api.reporting.domain.AerSave;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissions;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerAggregatedDataEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerPortEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSmfEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSubmitRequestTaskSyncAerAttachmentsService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerTotalEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerVoyageEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerImportThirdPartyDataRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestAerApplyServiceTest {

    @InjectMocks
    private RequestAerApplyService service;

    @Mock
    private AerSubmitRequestTaskSyncAerAttachmentsService syncAerAttachmentsService;

    @Mock
    private StagingAerRepository stagingAerRepository;

    @Mock
    private DateService dateService;

    @Mock
    private AerPortEmissionsCalculator portEmissionsCalculator;

    @Mock
    private AerVoyageEmissionsCalculator voyageEmissionsCalculator;

    @Mock
    private AerAggregatedDataEmissionsCalculator aggregatedDataEmissionsCalculator;

    @Mock
    private AerSmfEmissionsCalculator smfEmissionsCalculator;

    @Mock
    private AerTotalEmissionsCalculator totalEmissionsCalculator;

    @ParameterizedTest
    @MethodSource("applySaveActionScenarios")
    void applySaveAction(String thirdPartyDataProviderName, Aer existingAer) {
        AerSave aerSave = AerSave.builder()
            .additionalDocuments(AdditionalDocuments.builder().exist(true).build())
            .build();
        Aer aer = Aer.builder()
            .additionalDocuments(AdditionalDocuments.builder().exist(true).build())
            .thirdPartyDataProviderName(thirdPartyDataProviderName)
            .build();

        AerSaveApplicationRequestTaskActionPayload taskActionPayload =
            AerSaveApplicationRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.AER_SAVE_APPLICATION_PAYLOAD)
                .reportingRequired(true)
                .aer(aerSave)
                .aerSectionsCompleted(Map.of(AdditionalDocuments.class.getName(), "COMPLETED"))
                .build();

        AerApplicationSubmitRequestTaskPayload requestTaskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_SUBMIT_PAYLOAD)
            .aer(existingAer)
            .build();

        RequestTask requestTask = RequestTask.builder()
            .payload(requestTaskPayload)
            .build();

        //invoke
        service.applySaveAction(taskActionPayload, requestTask);

        AerApplicationSubmitRequestTaskPayload payloadSaved =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        assertNotNull(payloadSaved.getAer());
        assertTrue(payloadSaved.getReportingRequired());
        assertThat(payloadSaved.getAerSectionsCompleted()).containsExactly(Map.entry(AdditionalDocuments.class.getName(), "COMPLETED"));
        assertThat(payloadSaved.getAer().getThirdPartyDataProviderName()).isEqualTo(thirdPartyDataProviderName);
        assertFalse(payloadSaved.isVerificationPerformed());

        verify(syncAerAttachmentsService).sync(taskActionPayload.getReportingRequired(), requestTaskPayload);
        verify(portEmissionsCalculator).calculateEmissions(aer);
        verify(voyageEmissionsCalculator).calculateEmissions(aer);
        verify(smfEmissionsCalculator).calculateEmissions(aer);
        verify(aggregatedDataEmissionsCalculator).calculateEmissions(aer);
        verify(totalEmissionsCalculator).calculateEmissions(aer);

        verifyNoMoreInteractions(portEmissionsCalculator, voyageEmissionsCalculator,
            smfEmissionsCalculator, aggregatedDataEmissionsCalculator, totalEmissionsCalculator);
    }

    @Test
    void applyStagingData() {
        long accountId = 1L;
        Year year = Year.now();
        LocalDateTime now = LocalDateTime.now();

        Map<String, String> newSectionsCompleted = Map.of("A", "COMPLETED");
        Map<String, String> oldSectionsCompleted = Map.of("B", "COMPLETED");

        AerOperatorDetails operatorDetails = mock(AerOperatorDetails.class);
        AdditionalDocuments additionalDocuments = mock(AdditionalDocuments.class);
        AerMonitoringPlanChanges aerMonitoringPlanChanges = mock(AerMonitoringPlanChanges.class);
        AerPortEmissions portEmissions = mock(AerPortEmissions.class);
        AerVoyageEmissions voyageEmissions = mock(AerVoyageEmissions.class);
        AerTotalEmissions totalEmissions = mock(AerTotalEmissions.class);
        AerApplicationSubmitRequestTaskPayload requestTaskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_SUBMIT_PAYLOAD)
            .reportingRequired(true)
            .verificationPerformed(true)
            .aerSectionsCompleted(oldSectionsCompleted)
            .aer(Aer.builder()
                .smf(mock(AerSmf.class))
                .emissions(mock(AerEmissions.class))
                .aggregatedData(mock(AerAggregatedData.class))
                .operatorDetails(operatorDetails)
                .additionalDocuments(additionalDocuments)
                .aerMonitoringPlanChanges(aerMonitoringPlanChanges)
                .portEmissions(portEmissions)
                .voyageEmissions(voyageEmissions)
                .totalEmissions(totalEmissions)
                .build())
            .reportingYear(year)
            .build();


        AerEmissions emissions = mock(AerEmissions.class);
        AerAggregatedData aggregatedData = mock(AerAggregatedData.class);
        AerSmf aerSmf = mock(AerSmf.class);

        StagingAerEntity stagingAerEntity = StagingAerEntity.builder()
            .payload(StagingAer.builder()
                .emissions(emissions).aggregatedData(aggregatedData).smf(aerSmf)
                .build())
            .build();

        StagingAerEntity expectedStagingAerEntity = StagingAerEntity.builder()
            .payload(StagingAer.builder()
                .emissions(emissions).aggregatedData(aggregatedData).smf(aerSmf)
                .build())
            .importStatus(StagingImportStatus.IMPORTED)
            .importedOn(now)
            .build();

        Aer expectedAer = Aer.builder()
            .smf(aerSmf)
            .emissions(emissions)
            .aggregatedData(aggregatedData)
            .operatorDetails(operatorDetails)
            .additionalDocuments(additionalDocuments)
            .aerMonitoringPlanChanges(aerMonitoringPlanChanges)
            .portEmissions(portEmissions)
            .voyageEmissions(voyageEmissions)
            .totalEmissions(totalEmissions)
            .build();
        AerApplicationSubmitRequestTaskPayload expectedRequestTaskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_SUBMIT_PAYLOAD)
            .reportingRequired(true)
            .verificationPerformed(false)
            .aer(expectedAer)
            .aerSectionsCompleted(newSectionsCompleted)
            .reportingYear(year)
            .build();

        final Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .build();

        RequestTask requestTask = RequestTask.builder()
            .payload(requestTaskPayload)
            .request(request)
            .build();

        when(dateService.getLocalDateTime()).thenReturn(now);
        when(stagingAerRepository.findByAccountIdAndYear(accountId, year)).thenReturn(Optional.of(stagingAerEntity));

        AerImportThirdPartyDataRequestTaskActionPayload requestTaskActionPayload = AerImportThirdPartyDataRequestTaskActionPayload.builder()
            .aerSectionsCompleted(newSectionsCompleted)
            .build();

        service.applyStagingData(requestTask, requestTaskActionPayload);

        assertThat(requestTask.getPayload()).isEqualTo(expectedRequestTaskPayload);
        assertThat(stagingAerEntity).isEqualTo(expectedStagingAerEntity);

        verify(portEmissionsCalculator).calculateEmissions(expectedAer);
        verify(voyageEmissionsCalculator).calculateEmissions(expectedAer);
        verify(smfEmissionsCalculator).calculateEmissions(expectedAer);
        verify(aggregatedDataEmissionsCalculator).calculateEmissions(expectedAer);
        verify(totalEmissionsCalculator).calculateEmissions(expectedAer);
        verify(dateService).getLocalDateTime();
        verify(stagingAerRepository).findByAccountIdAndYear(accountId, year);

        verifyNoMoreInteractions(dateService, stagingAerRepository, portEmissionsCalculator,
            voyageEmissionsCalculator, smfEmissionsCalculator, aggregatedDataEmissionsCalculator, totalEmissionsCalculator);
    }

    @Test
    void applyStagingData_throws_exception() {
        AerApplicationSubmitRequestTaskPayload requestTaskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .reportingRequired(false)
            .build();

        RequestTask requestTask = RequestTask.builder()
            .payload(requestTaskPayload)
            .build();

        AerImportThirdPartyDataRequestTaskActionPayload requestTaskActionPayload = AerImportThirdPartyDataRequestTaskActionPayload.builder()
            .build();

        BusinessException businessException = assertThrows(BusinessException.class, () ->
            service.applyStagingData(requestTask, requestTaskActionPayload));

        // Verify
        assertEquals(MrtmErrorCode.AER_IMPORT_EXTERNAL_DATA_NOT_ALLOWED, businessException.getErrorCode());

        verifyNoInteractions(dateService, stagingAerRepository, portEmissionsCalculator,
            voyageEmissionsCalculator, smfEmissionsCalculator, aggregatedDataEmissionsCalculator, totalEmissionsCalculator);
    }

    private static Stream<Arguments> applySaveActionScenarios() {
        String thirdPartyDataProviderName = "thirdPartyDataProviderName";

        return Stream.of(
            Arguments.of(thirdPartyDataProviderName, Aer.builder().thirdPartyDataProviderName(thirdPartyDataProviderName).build()),
            Arguments.of(null, null)
        );
    }
}