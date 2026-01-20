package uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerReportingObligationDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecisionType;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifiedSatisfactoryDecision;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.EmpOriginatedData;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.service.RequestAerSubmitService;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.SendRegistryUpdatedEventAddRequestActionService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType.AER;

@ExtendWith(MockitoExtension.class)
class RequestAerSubmitServiceTest {

    @InjectMocks
    private RequestAerSubmitService requestAerSubmitService;

    @Mock
    private AerValidatorService aerValidator;

    @Mock
    private RequestService requestService;

    @Mock
    private AerSubmitMapper aerSubmitMapper;

    @Mock
    private ReportableEmissionsService reportableEmissionsService;

    @Mock
    private SendRegistryUpdatedEventAddRequestActionService sendRegistryUpdatedEventAddRequestActionService;

    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void sendToVerifier(boolean reportingRequired) {
        AppUser appUser = AppUser.builder().userId("userId").build();

        AerTotalReportableEmissions totalReportableEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(new BigDecimal("1"))
            .surrenderEmissions(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("3"))
            .build();

        AerTotalEmissions totalEmissions = AerTotalEmissions.builder()
            .totalShipEmissionsSummary(new BigDecimal("1"))
            .surrenderEmissionsSummary(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(AerPortEmissionsMeasurement.builder().total(new BigDecimal("3")).build())
            .build();

        AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
            .build();
        long accountId = 1L;
        Request request = Request.builder()
            .type(RequestType.builder().code(AER).build())
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(aerRequestPayload)
            .build();

        Aer aer = Aer.builder().totalEmissions(totalEmissions).build();
        Map<String, String> aerSectionsCompleted = Map.of("Aer Section 1", "true");
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "attachment 1");
        EmpOriginatedData empOriginatedData = EmpOriginatedData.builder()
            .operatorDetails(EmpOperatorDetails.builder()
                .operatorName("operatorName")
                .build())
            .build();
        AerApplicationSubmitRequestTaskPayload aerSubmitRequestTaskPayload =
            AerApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_SUBMIT_PAYLOAD)
                .reportingRequired(reportingRequired)
                .verificationPerformed(true)
                .aer(aer)
                .aerSectionsCompleted(aerSectionsCompleted)
                .aerAttachments(aerAttachments)
                .empOriginatedData(empOriginatedData)
                .build();
        RequestTask requestTask = RequestTask.builder()
            .type(RequestTaskType.builder().code(AER_APPLICATION_SUBMIT).build())
            .request(request)
            .payload(aerSubmitRequestTaskPayload)
            .build();

        AerContainer aerContainer = AerContainer.builder().reportingRequired(Boolean.TRUE).aer(aer).build();

        AerApplicationSubmittedRequestActionPayload submittedRequestActionPayload =
            AerApplicationSubmittedRequestActionPayload.builder()
                .reportingRequired(true)
                .aer(aer)
                .build();

        when(aerSubmitMapper.toAerContainer(aerSubmitRequestTaskPayload))
            .thenReturn(aerContainer);
        doNothing().when(aerValidator).validateAer(aerContainer, accountId);
        when(aerSubmitMapper
            .toAerApplicationSubmittedRequestActionPayload(aerSubmitRequestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_SUBMITTED_PAYLOAD))
            .thenReturn(submittedRequestActionPayload);

        requestAerSubmitService.sendToVerifier(requestTask, appUser);

        AerRequestPayload updatedRequestPayload = (AerRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());
        assertEquals(reportingRequired, updatedRequestPayload.getReportingRequired());
        assertNull(updatedRequestPayload.getReportingObligationDetails());
        assertTrue(updatedRequestPayload.isVerificationPerformed());
        assertEquals(aer, updatedRequestPayload.getAer());
        assertThat(updatedRequestPayload.getAerAttachments()).containsExactlyInAnyOrderEntriesOf(aerAttachments);
        assertThat(updatedRequestPayload.getTotalEmissions()).isEqualTo(reportingRequired ? totalReportableEmissions : null);
        assertEquals(empOriginatedData, updatedRequestPayload.getEmpOriginatedData());
        assertThat(updatedRequestPayload.getAerSubmitSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(aerSectionsCompleted);

        verify(aerSubmitMapper, times(1))
            .toAerContainer(aerSubmitRequestTaskPayload);
        verify(aerValidator, times(1)).validateAer(aerContainer, accountId);
        verify(aerSubmitMapper, times(1))
            .toAerApplicationSubmittedRequestActionPayload(aerSubmitRequestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_SUBMITTED_PAYLOAD);
        verify(requestService, times(1)).addActionToRequest(
            request, submittedRequestActionPayload, MrtmRequestActionType.AER_APPLICATION_SENT_TO_VERIFIER, appUser.getUserId());
    }

    @ParameterizedTest
    @MethodSource("sendToRegulatorScenarios")
    void sendToRegulator(boolean reportingRequired, int updateReportableEmissionsInvocations,
                         AerTotalReportableEmissions metadataEmissions, boolean hasVerificationData) {
        String userId = "userId";
        AppUser appUser = AppUser.builder().userId(userId).build();

        AerTotalReportableEmissions totalReportableEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(new BigDecimal("1"))
            .surrenderEmissions(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("3"))
            .build();

        AerTotalEmissions totalEmissions = AerTotalEmissions.builder()
            .totalShipEmissionsSummary(new BigDecimal("1"))
            .surrenderEmissionsSummary(new BigDecimal("2"))
            .lessVoyagesInNorthernIrelandDeduction(AerPortEmissionsMeasurement.builder().total(new BigDecimal("3")).build())
            .build();

        AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
            .build();
        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().build();

        long accountId = 1L;
        Request request = Request.builder()
            .type(RequestType.builder().code(AER).build())
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(aerRequestPayload)
            .metadata(aerRequestMetadata)
            .build();

        Aer aer = Aer.builder().totalEmissions(totalEmissions).build();
        Map<String, String> aerSectionsCompleted = Map.of("Aer Section 1", "true");
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "attachment 1");
        EmpOriginatedData empOriginatedData = EmpOriginatedData.builder()
            .operatorDetails(EmpOperatorDetails.builder()
                .operatorName("operatorName")
                .build())
            .build();
        AerApplicationSubmitRequestTaskPayload aerSubmitRequestTaskPayload =
            AerApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_SUBMIT_PAYLOAD)
                .reportingRequired(reportingRequired)
                .verificationPerformed(true)
                .aer(aer)
                .aerSectionsCompleted(aerSectionsCompleted)
                .aerAttachments(aerAttachments)
                .empOriginatedData(empOriginatedData)
                .build();
        RequestTask requestTask = RequestTask.builder()
            .type(RequestTaskType.builder().code(AER_APPLICATION_SUBMIT).build())
            .request(request)
            .payload(aerSubmitRequestTaskPayload)
            .build();

        Year reportingYear = Year.now();
        AerContainer aerContainer = AerContainer.builder()
            .reportingRequired(reportingRequired)
            .reportingYear(reportingYear)
            .reportingObligationDetails(AerReportingObligationDetails.builder().noReportingReason("reason").build())
            .verificationReport(
                hasVerificationData ?
                    AerVerificationReport.builder()
                    .verificationData(AerVerificationData.builder()
                        .overallDecision(AerVerifiedSatisfactoryDecision.builder()
                            .type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY)
                            .build())
                        .build()
                    )
                    .build() : null)
            .build();
        AerApplicationSubmittedRequestActionPayload submittedRequestActionPayload =
            AerApplicationSubmittedRequestActionPayload.builder()
                .reportingRequired(false)
                .reportingObligationDetails(AerReportingObligationDetails.builder().noReportingReason("reason").build())
                .build();
        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails =
            mock(ReportableEmissionsUpdatedSubmittedEventDetails.class);
        when(aerSubmitMapper.toAerContainer(aerSubmitRequestTaskPayload, aerRequestPayload.getVerificationReport()))
            .thenReturn(aerContainer);
        doNothing().when(aerValidator).validate(aerContainer, accountId);
        when(aerSubmitMapper
            .toAerApplicationSubmittedRequestActionPayload(aerSubmitRequestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_SUBMITTED_PAYLOAD))
            .thenReturn(submittedRequestActionPayload);
        lenient().when(reportableEmissionsService.calculateTotalReportableEmissions(aerContainer))
            .thenReturn(totalReportableEmissions);
        lenient().when(reportableEmissionsService.updateReportableEmissions(totalReportableEmissions, reportingYear, accountId, false))
            .thenReturn(eventDetails);

        requestAerSubmitService.sendToRegulator(requestTask, appUser);

        AerRequestPayload updatedRequestPayload = (AerRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());
        assertEquals(reportingRequired, updatedRequestPayload.getReportingRequired());
        assertNull(updatedRequestPayload.getReportingObligationDetails());
        assertTrue(updatedRequestPayload.isVerificationPerformed());
        assertEquals(aer, updatedRequestPayload.getAer());
        assertThat(updatedRequestPayload.getAerAttachments()).containsExactlyInAnyOrderEntriesOf(aerAttachments);
        assertThat(updatedRequestPayload.getTotalEmissions()).isEqualTo(reportingRequired ? totalReportableEmissions : null);
        assertEquals(empOriginatedData, updatedRequestPayload.getEmpOriginatedData());
        assertThat(updatedRequestPayload.getAerSubmitSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(aerSectionsCompleted);

        AerRequestMetadata updatedRequestMetadata = (AerRequestMetadata) request.getMetadata();
        assertEquals(metadataEmissions, updatedRequestMetadata.getEmissions());
        assertEquals(hasVerificationData ? AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY : null,
            updatedRequestMetadata.getOverallAssessmentType());

        verify(aerSubmitMapper, times(1))
            .toAerContainer(aerSubmitRequestTaskPayload, aerRequestPayload.getVerificationReport());
        verify(aerValidator, times(1)).validate(aerContainer, accountId);
        verify(aerSubmitMapper, times(1))
            .toAerApplicationSubmittedRequestActionPayload(aerSubmitRequestTaskPayload, MrtmRequestActionPayloadType.AER_APPLICATION_SUBMITTED_PAYLOAD);
        verify(requestService, times(1)).addActionToRequest(
            request, submittedRequestActionPayload, MrtmRequestActionType.AER_APPLICATION_SUBMITTED, appUser.getUserId());
        verify(reportableEmissionsService, times(updateReportableEmissionsInvocations)).calculateTotalReportableEmissions(aerContainer);
        verify(reportableEmissionsService, times(updateReportableEmissionsInvocations))
            .updateReportableEmissions(totalReportableEmissions, reportingYear, accountId, false);
        verify(sendRegistryUpdatedEventAddRequestActionService, times(updateReportableEmissionsInvocations))
            .addRequestAction(request, eventDetails, userId);

        verifyNoMoreInteractions(aerSubmitMapper, aerValidator, requestService, reportableEmissionsService);
    }

    public static Stream<Arguments> sendToRegulatorScenarios() {
        return Stream.of(
            Arguments.of(true, 1, createTotalReportableEmissions(), false),
            Arguments.of(true, 1, createTotalReportableEmissions(), true),
            Arguments.of(false, 0, null, false),
            Arguments.of(false, 0, null, false)
        );
    }

    private static AerTotalReportableEmissions createTotalReportableEmissions() {
        return AerTotalReportableEmissions.builder()
                .totalEmissions(new BigDecimal("1"))
                .surrenderEmissions(new BigDecimal("2"))
                .lessVoyagesInNorthernIrelandDeduction(new BigDecimal("3"))
                .build();
    }
}