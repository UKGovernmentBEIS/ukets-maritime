package uk.gov.mrtm.api.workflow.request.flow.aer.verify.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationTeamDetails;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifierContact;
import uk.gov.mrtm.api.reporting.validation.AerVerificationReportValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.mapper.AerVerifyMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestAerSubmitVerificationServiceTest {

    @InjectMocks
    private RequestAerSubmitVerificationService submitVerificationService;

    @Mock
    private AerVerificationReportValidatorService verificationReportValidatorService;

    @Mock
    private RequestService requestService;
    
    @Mock
    private AerVerifyMapper aerVerifyMapper;

    @ParameterizedTest
    @MethodSource("submitVerificationReportScenarios")
    void submitVerificationReport(boolean isVerificationPerformed,
                                  Map<AerReviewGroup, AerReviewDecision> requestPayloadReviewGroupDecisions,
                                  Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions) {
        long accountId = 1L;
        long verificationBodyId = 1L;
        BigDecimal totalEmissionsProvided = BigDecimal.valueOf(14500);
        BigDecimal surrenderEmissions = BigDecimal.valueOf(4578);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(4567);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(234);
        String notCoveredChangesProvided = "not covered changes";
        AerTotalReportableEmissions totalEmissions = AerTotalReportableEmissions.builder()
                .totalEmissions(totalEmissionsProvided)
                .surrenderEmissions(surrenderEmissions)
                .lessIslandFerryDeduction(lessIslandFerryDeduction)
                .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                .build();

        AerVerificationReport verificationReport = AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                        .verifierContact(AerVerifierContact.builder().name("name").build())
                        .verificationTeamDetails(AerVerificationTeamDetails.builder().leadEtsAuditor("leadEtsAuditor").build())
                        .build())
                .build();
        AerApplicationVerificationSubmitRequestTaskPayload verificationSubmitRequestTaskPayload =
                AerApplicationVerificationSubmitRequestTaskPayload.builder()
                        .verificationReport(verificationReport)
                        .totalEmissions(totalEmissions)
                        .notCoveredChangesProvided(notCoveredChangesProvided)
                        .build();
        Aer aer = Aer.builder()
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .build();
        AerRequestPayload requestPayload = AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
                .reportingRequired(Boolean.TRUE)
                .verificationReport(isVerificationPerformed ? verificationReport : null)
                .reviewGroupDecisions(requestPayloadReviewGroupDecisions)
                .aer(aer)
                .build();
        Request request = Request.builder().payload(requestPayload).requestResources(List.of(RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(Long.toString(accountId)).build(),
                RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(Long.toString(verificationBodyId)).build())).build();
        RequestTask requestTask = RequestTask.builder().payload(verificationSubmitRequestTaskPayload).request(request).build();
        AppUser appUser = AppUser.builder().userId("userId").build();
        AerApplicationVerificationSubmittedRequestActionPayload verificationSubmittedRequestActionPayload =
                AerApplicationVerificationSubmittedRequestActionPayload.builder().build();

        when(aerVerifyMapper.toAerApplicationVerificationSubmittedRequestActionPayload(
                verificationSubmitRequestTaskPayload,
                MrtmRequestActionPayloadType.AER_APPLICATION_VERIFICATION_SUBMITTED_PAYLOAD))
                .thenReturn(verificationSubmittedRequestActionPayload);

        submitVerificationService.submitVerificationReport(requestTask, appUser);

        AerRequestPayload updatedRequestPayload = (AerRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());
        assertTrue(updatedRequestPayload.getReportingRequired());
        assertTrue(updatedRequestPayload.isVerificationPerformed());
        assertEquals(verificationReport, updatedRequestPayload.getVerificationReport());
        assertEquals(reviewGroupDecisions, updatedRequestPayload.getReviewGroupDecisions());
        assertEquals(notCoveredChangesProvided, updatedRequestPayload.getNotCoveredChangesProvided());

        verify(verificationReportValidatorService, times(1)).validate(verificationReport);
        verify(aerVerifyMapper, times(1))
                .toAerApplicationVerificationSubmittedRequestActionPayload(
                        verificationSubmitRequestTaskPayload,
                        MrtmRequestActionPayloadType.AER_APPLICATION_VERIFICATION_SUBMITTED_PAYLOAD);
        verify(requestService, times(1)).addActionToRequest(
                request,
                verificationSubmittedRequestActionPayload,
                MrtmRequestActionType.AER_APPLICATION_VERIFICATION_SUBMITTED,
                appUser.getUserId());
    }

    public static Stream<Arguments> submitVerificationReportScenarios() {
        Map<AerReviewGroup, AerReviewDecision> aerReviewGroups = new HashMap<>();
        aerReviewGroups.put(AerReviewGroup.VERIFIER_DETAILS, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.OPINION_STATEMENT, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.ETS_COMPLIANCE_RULES, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.COMPLIANCE_MONITORING_REPORTING, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.OVERALL_DECISION, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.UNCORRECTED_MISSTATEMENTS, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.UNCORRECTED_NON_CONFORMITIES, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.UNCORRECTED_NON_COMPLIANCES, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.RECOMMENDED_IMPROVEMENTS, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.CLOSE_DATA_GAPS_METHODOLOGIES, AerDataReviewDecision.builder().build());
        aerReviewGroups.put(AerReviewGroup.MATERIALITY_LEVEL, AerDataReviewDecision.builder().build());

        return Stream.of(
            Arguments.of(true, aerReviewGroups, aerReviewGroups),
            Arguments.of(false, aerReviewGroups, aerReviewGroups)
        );
    }
}
