package uk.gov.mrtm.api.workflow.request.flow.aer.verify.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerification;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerificationEntity;
import uk.gov.mrtm.api.integration.external.verification.repository.StagingAerVerificationRepository;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.domain.verification.AerComplianceMonitoringReporting;
import uk.gov.mrtm.api.reporting.domain.verification.AerDataGapsMethodologies;
import uk.gov.mrtm.api.reporting.domain.verification.AerEmissionsReductionClaimVerification;
import uk.gov.mrtm.api.reporting.domain.verification.AerEtsComplianceRules;
import uk.gov.mrtm.api.reporting.domain.verification.AerMaterialityLevel;
import uk.gov.mrtm.api.reporting.domain.verification.AerOpinionStatement;
import uk.gov.mrtm.api.reporting.domain.verification.AerRecommendedImprovements;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedMisstatements;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonCompliances;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonConformities;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecision;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationTeamDetails;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifierContact;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerSaveApplicationVerificationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationImportThirdPartyDataRequestTaskActionPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestAerApplyVerificationServiceTest {

    @InjectMocks
    private RequestAerApplyVerificationService service;

    @Mock
    private StagingAerVerificationRepository stagingAerVerificationRepository;

    @Mock
    private DateService dateService;

    @Test
    void applySaveAction() {

        final Long accountId = 100L;
        final String requestId = "requestId";
        final Long verificationBodyId = 101L;


        final AerVerificationData verificationData = AerVerificationData.builder()

                .build();

        final Map<String, String> sectionsCompleted = Map.of("subtask", "completed");

        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD).build();

        final Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build(),
                        RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(verificationBodyId.toString()).build()))
                .payload(aerRequestPayload)
                .build();

        final AerSaveApplicationVerificationRequestTaskActionPayload taskActionPayload =
                AerSaveApplicationVerificationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.AER_SAVE_APPLICATION_VERIFICATION_PAYLOAD)
                        .verificationData(verificationData)
                        .verificationSectionsCompleted(sectionsCompleted)
                        .build();

        final AerApplicationVerificationSubmitRequestTaskPayload taskPayload = AerApplicationVerificationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_VERIFICATION_SUBMIT_PAYLOAD)
                .verificationReport(AerVerificationReport.builder().build())
                .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .request(request)
                .build();

        service.applySaveAction(taskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isInstanceOf(AerApplicationVerificationSubmitRequestTaskPayload.class);
        AerApplicationVerificationSubmitRequestTaskPayload resultPayload =
                (AerApplicationVerificationSubmitRequestTaskPayload) requestTask.getPayload();
        assertThat(resultPayload.getVerificationReport().getVerificationData()).isEqualTo(verificationData);
        assertThat(resultPayload.getVerificationSectionsCompleted()).isEqualTo(sectionsCompleted);

        assertThat(((AerRequestPayload) request.getPayload()).getVerificationReport())
                .isEqualTo(taskPayload.getVerificationReport());

        assertThat(((AerRequestPayload) request.getPayload()).isVerificationPerformed()).isFalse();

        assertThat(((AerRequestPayload) request.getPayload()).getVerificationReport().getVerificationBodyId())
                .isEqualTo(verificationBodyId);

        assertThat(((AerRequestPayload) request.getPayload()).getVerificationSectionsCompleted())
                .containsExactlyEntriesOf(taskActionPayload.getVerificationSectionsCompleted());

        verifyNoInteractions(stagingAerVerificationRepository, dateService);
    }

    @ParameterizedTest
    @ValueSource(booleans =  {true, false})
    void applyStagingData(boolean smfExist) {
        final Long accountId = 100L;
        final Long verificationBodyId = 123L;
        final String requestId = "requestId";
        final Year year = Year.now();
        final LocalDateTime now = LocalDateTime.now();
        final Map<String, String> sectionsCompleted = Map.of("subtask", "completed");

        final Request request = Request.builder()
            .id(requestId)
            .payload(AerRequestPayload.builder().build())
            .requestResources(List.of(
                RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build(),
                RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(verificationBodyId.toString()).build()))
            .build();

        final AerVerificationImportThirdPartyDataRequestTaskActionPayload taskActionPayload =
            AerVerificationImportThirdPartyDataRequestTaskActionPayload.builder()
                .verificationSectionsCompleted(sectionsCompleted)
                .build();

        AerEmissionsReductionClaimVerification previousErc = mock(AerEmissionsReductionClaimVerification.class);
        final AerApplicationVerificationSubmitRequestTaskPayload taskPayload = AerApplicationVerificationSubmitRequestTaskPayload.builder()
            .verificationReport(AerVerificationReport.builder()
                .verificationBodyId(321L)
                .verificationData(AerVerificationData.builder().emissionsReductionClaimVerification(previousErc).build())
                .build())
            .aer(Aer.builder().smf(AerSmf.builder().exist(smfExist).build()).build())
            .reportingYear(year)
            .build();

        final RequestTask requestTask = RequestTask.builder()
            .payload(taskPayload)
            .request(request)
            .build();

        AerVerifierContact aerVerifierContact = mock(AerVerifierContact.class);
        AerVerificationTeamDetails aerVerificationTeamDetails = mock(AerVerificationTeamDetails.class);
        AerOpinionStatement aerOpinionStatement = mock(AerOpinionStatement.class);
        AerUncorrectedNonCompliances aerUncorrectedNonCompliances = mock(AerUncorrectedNonCompliances.class);
        AerUncorrectedMisstatements aerUncorrectedMisstatements = mock(AerUncorrectedMisstatements.class);
        AerVerificationDecision aerVerificationDecision = mock(AerVerificationDecision.class);
        AerUncorrectedNonConformities aerUncorrectedNonConformities = mock(AerUncorrectedNonConformities.class);
        AerRecommendedImprovements aerRecommendedImprovements = mock(AerRecommendedImprovements.class);
        AerEmissionsReductionClaimVerification aerEmissionsReductionClaimVerification = mock(AerEmissionsReductionClaimVerification.class);
        AerMaterialityLevel aerMaterialityLevel = mock(AerMaterialityLevel.class);
        AerEtsComplianceRules aerEtsComplianceRules = mock(AerEtsComplianceRules.class);
        AerComplianceMonitoringReporting aerComplianceMonitoringReporting = mock(AerComplianceMonitoringReporting.class);
        AerDataGapsMethodologies aerDataGapsMethodologies = mock(AerDataGapsMethodologies.class);

        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationBodyId(verificationBodyId)
            .verificationData(AerVerificationData.builder()
                .verifierContact(aerVerifierContact)
                .verificationTeamDetails(aerVerificationTeamDetails)
                .opinionStatement(aerOpinionStatement)
                .uncorrectedNonCompliances(aerUncorrectedNonCompliances)
                .uncorrectedMisstatements(aerUncorrectedMisstatements)
                .overallDecision(aerVerificationDecision)
                .uncorrectedNonConformities(aerUncorrectedNonConformities)
                .recommendedImprovements(aerRecommendedImprovements)
                .emissionsReductionClaimVerification(smfExist ? aerEmissionsReductionClaimVerification : previousErc)
                .materialityLevel(aerMaterialityLevel)
                .etsComplianceRules(aerEtsComplianceRules)
                .complianceMonitoringReporting(aerComplianceMonitoringReporting)
                .dataGapsMethodologies(aerDataGapsMethodologies)
                .build()).build();

        final AerApplicationVerificationSubmitRequestTaskPayload expectedTaskPayload = AerApplicationVerificationSubmitRequestTaskPayload.builder()
            .verificationSectionsCompleted(sectionsCompleted)
            .verificationReport(verificationReport)
            .aer(Aer.builder().smf(AerSmf.builder().exist(smfExist).build()).build())
            .reportingYear(year)
            .build();

        final AerRequestPayload expectedRequestPayload = AerRequestPayload.builder()
            .verificationSectionsCompleted(sectionsCompleted)
            .verificationReport(verificationReport)
            .build();

        StagingAerVerification stagingPayload = StagingAerVerification.builder()
            .verifierContact(aerVerifierContact)
            .verificationTeamDetails(aerVerificationTeamDetails)
            .opinionStatement(aerOpinionStatement)
            .uncorrectedNonCompliances(aerUncorrectedNonCompliances)
            .uncorrectedMisstatements(aerUncorrectedMisstatements)
            .overallDecision(aerVerificationDecision)
            .uncorrectedNonConformities(aerUncorrectedNonConformities)
            .recommendedImprovements(aerRecommendedImprovements)
            .emissionsReductionClaimVerification(aerEmissionsReductionClaimVerification)
            .materialityLevel(aerMaterialityLevel)
            .etsComplianceRules(aerEtsComplianceRules)
            .complianceMonitoringReporting(aerComplianceMonitoringReporting)
            .dataGapsMethodologies(aerDataGapsMethodologies)
            .build();

        StagingAerVerificationEntity stagingAerVerificationEntity = StagingAerVerificationEntity.builder()
            .providerName("providerName")
            .payload(stagingPayload)
            .build();

        when(stagingAerVerificationRepository.findByAccountIdAndYear(accountId, year)).thenReturn(Optional.of(stagingAerVerificationEntity));
        when(dateService.getLocalDateTime()).thenReturn(now);

        service.applyStagingData(requestTask, taskActionPayload);

        assertEquals(expectedTaskPayload, taskPayload);
        assertEquals(expectedRequestPayload, request.getPayload());
        assertEquals(now, stagingAerVerificationEntity.getImportedOn());

        verify(stagingAerVerificationRepository).findByAccountIdAndYear(accountId, year);
        verify(dateService).getLocalDateTime();
        verifyNoMoreInteractions(stagingAerVerificationRepository, dateService);
    }
}
