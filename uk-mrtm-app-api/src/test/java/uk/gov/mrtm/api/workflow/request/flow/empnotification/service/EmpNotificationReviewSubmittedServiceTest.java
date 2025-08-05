package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.DateOfNonSignificantChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotification;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationDetailsOfChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationReviewSubmittedServiceTest {

    @InjectMocks
    private EmpNotificationReviewSubmittedService service;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestActionUserInfoResolver requestActionUserInfoResolver;

    @Mock
    private EmpNotificationOfficialNoticeService noticeService;

    @Test
    void executeGrantedPostActions() {
        final String requestId = "1";
        Long accountId = 1L;
        DecisionNotification reviewDecisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator1"))
                .signatory("regulator1")
                .build();
        EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_NOTIFICATION_REQUEST_PAYLOAD)
                .reviewDecision(EmpNotificationReviewDecision.builder()
                        .type(EmpNotificationReviewDecisionType.ACCEPTED)
                        .details(
                                EmpNotificationAcceptedDecisionDetails.builder()
                                        .notes("notes")
                                        .officialNotice("officialNotice")
                                        .followUp(FollowUp.builder()
                                                .followUpResponseRequired(false)
                                                .build())
                                        .build()
                        )
                        .build())
                .reviewDecisionNotification(reviewDecisionNotification)
                .regulatorReviewer("regulatorReviewer")
                .build();
        Request request = Request.builder()
                .id(requestId)
                .payload(requestPayload)
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .build();

        EmpNotificationReviewDecision expectedReviewDecision = EmpNotificationReviewDecision.builder()
                .type(requestPayload.getReviewDecision().getType())
                .details(
                        EmpNotificationAcceptedDecisionDetails.builder()
                                .notes("notes")
                                .officialNotice(((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getOfficialNotice())
                                .followUp(((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getFollowUp())
                                .build()
                )
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestActionUserInfoResolver
                .getUsersInfo(reviewDecisionNotification.getOperators(), reviewDecisionNotification.getSignatory(), request))
                .thenReturn(Map.of(
                        "operator1", RequestActionUserInfo.builder().name("operator1").roleCode("operator").build(),
                        "regulator1", RequestActionUserInfo.builder().name("regulator1").roleCode("regulator").build()
                ));

        // Invoke
        service.executeGrantedPostActions(requestId);

        // Verify
        verify(requestActionUserInfoResolver, times(1))
                .getUsersInfo(reviewDecisionNotification.getOperators(), reviewDecisionNotification.getSignatory(), request);
        verify(noticeService, times(1)).sendOfficialNotice(request);

        ArgumentCaptor<EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload>
                requestActionPayloadCaptor =
                ArgumentCaptor.forClass(EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload.class);
        verify(requestService, times(1)).addActionToRequest(Mockito.eq(request), requestActionPayloadCaptor.capture(),
                Mockito.eq(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_GRANTED),
                Mockito.eq(requestPayload.getRegulatorReviewer()));

        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actionPayloadCaptured =
                requestActionPayloadCaptor.getValue();
        assertThat(actionPayloadCaptured.getPayloadType()).isEqualTo(
                MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_GRANTED_PAYLOAD);
        assertThat(actionPayloadCaptured.getUsersInfo()).isEqualTo(Map.of(
                "operator1", RequestActionUserInfo.builder().name("operator1").roleCode("operator").build(),
                "regulator1", RequestActionUserInfo.builder().name("regulator1").roleCode("regulator").build()
        ));
        assertThat(actionPayloadCaptured.getReviewDecisionNotification()).isEqualTo(
                requestPayload.getReviewDecisionNotification());
        assertThat(actionPayloadCaptured.getReviewDecision()).usingRecursiveComparison().isEqualTo(expectedReviewDecision);
    }

    @Test
    void executeRejectedPostActions() {
        final String requestId = "1";
        Long accountId = 1L;
        DecisionNotification reviewDecisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator1"))
                .signatory("regulator1")
                .build();
        EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_NOTIFICATION_REQUEST_PAYLOAD)
                .reviewDecision(EmpNotificationReviewDecision.builder()
                        .type(EmpNotificationReviewDecisionType.REJECTED)
                        .details(
                                EmpNotificationAcceptedDecisionDetails.builder()
                                        .notes("notes")
                                        .officialNotice("officialNotice")
                                        .followUp(FollowUp.builder()
                                                .followUpRequest("the request")
                                                .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                                                .build())
                                        .build()
                        )
                        .build())
                .reviewDecisionNotification(reviewDecisionNotification)
                .regulatorReviewer("regulatorReviewer")
                .build();
        Request request = Request.builder()
                .id(requestId)
                .payload(requestPayload)
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .build();

        EmpNotificationReviewDecision expectedReviewDecision = EmpNotificationReviewDecision.builder()
                .type(requestPayload.getReviewDecision().getType())
                .details(
                        EmpNotificationAcceptedDecisionDetails.builder()
                                .notes("notes")
                                .officialNotice(((EmpNotificationAcceptedDecisionDetails) requestPayload.getReviewDecision().getDetails()).getOfficialNotice())
                                .followUp(FollowUp.builder()
                                        .followUpRequest("the request")
                                        .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                                        .build())
                                .build()
                )
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestActionUserInfoResolver
                .getUsersInfo(reviewDecisionNotification.getOperators(), reviewDecisionNotification.getSignatory(), request))
                .thenReturn(Map.of(
                        "operator1", RequestActionUserInfo.builder().name("operator1").roleCode("operator").build(),
                        "regulator1", RequestActionUserInfo.builder().name("regulator1").roleCode("regulator").build()
                ));

        // Invoke
        service.executeRejectedPostActions(requestId);

        // Verify
        verify(requestActionUserInfoResolver, times(1))
                .getUsersInfo(reviewDecisionNotification.getOperators(), reviewDecisionNotification.getSignatory(), request);
        verify(noticeService, times(1)).sendOfficialNotice(request);

        ArgumentCaptor<EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload>
                requestActionPayloadCaptor =
                ArgumentCaptor.forClass(EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload.class);
        verify(requestService, times(1)).addActionToRequest(Mockito.eq(request), requestActionPayloadCaptor.capture(),
                Mockito.eq(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_REJECTED),
                Mockito.eq(requestPayload.getRegulatorReviewer()));

        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actionPayloadCaptured =
                requestActionPayloadCaptor.getValue();
        assertThat(actionPayloadCaptured.getPayloadType()).isEqualTo(
                MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_REJECTED_PAYLOAD);
        assertThat(actionPayloadCaptured.getUsersInfo()).isEqualTo(Map.of(
                "operator1", RequestActionUserInfo.builder().name("operator1").roleCode("operator").build(),
                "regulator1", RequestActionUserInfo.builder().name("regulator1").roleCode("regulator").build()
        ));
        assertThat(actionPayloadCaptured.getReviewDecisionNotification()).isEqualTo(
                requestPayload.getReviewDecisionNotification());
        assertThat(actionPayloadCaptured.getReviewDecision().getDetails()).usingRecursiveComparison().isEqualTo(expectedReviewDecision.getDetails());
    }

    @Test
    void executeFollowUpCompletedPostActions() {
        UUID randomUUID = UUID.randomUUID();

        final String requestId = "1";
        final Long accountId = 1L;
        final UUID file = UUID.randomUUID();
        DecisionNotification followUpReviewDecisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator1"))
                .signatory("regulator1")
                .build();
        final EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_NOTIFICATION_REQUEST_PAYLOAD)
                .emissionsMonitoringPlanNotification(
                        EmissionsMonitoringPlanNotification.builder()
                                .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                                        .description("description")
                                        .justification("justification")
                                        .documents(Set.of(randomUUID))
                                        .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                                                .startDate(LocalDate.now())
                                                .endDate(LocalDate.now().plusDays(1))
                                                .build())
                                        .build())
                                .build()
                       )
                .reviewDecision(EmpNotificationReviewDecision.builder().type(EmpNotificationReviewDecisionType.ACCEPTED).details(
                                EmpNotificationAcceptedDecisionDetails.builder()
                                        .officialNotice("officialNotice")
                                        .followUp(FollowUp.builder()
                                                .followUpRequest("follow up request")
                                                .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                                                .build()
                                        )
                                        .build()
                        )
                        .build())
                .followUpResponse("follow up response")
                .followUpResponseFiles(Set.of(file))
                .followUpResponseAttachments(Map.of(file, "filename"))
                .followUpResponseSubmissionDate(LocalDate.of(2023, 1, 1))
                .followUpReviewDecision(EmpNotificationFollowUpReviewDecision.builder()
                        .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED)
                        .details(new ReviewDecisionDetails("notes"))
                        .build())
                .followUpReviewDecisionNotification(followUpReviewDecisionNotification)
                .regulatorReviewer("regulatorReviewer")
                .build();
        final Request request = Request.builder()
                .id(requestId)
                .payload(requestPayload)
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .build();

        final EmpNotificationFollowUpReviewDecision expectedReviewDecision =
                EmpNotificationFollowUpReviewDecision.builder()
                        .type(requestPayload.getFollowUpReviewDecision().getType())
                        .details(new ReviewDecisionDetails("notes"))
                        .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestActionUserInfoResolver
                .getUsersInfo(followUpReviewDecisionNotification.getOperators(), followUpReviewDecisionNotification.getSignatory(), request))
                .thenReturn(Map.of(
                        "operator1", RequestActionUserInfo.builder().name("operator1").roleCode("operator").build(),
                        "regulator1", RequestActionUserInfo.builder().name("regulator1").roleCode("regulator").build()
                ));

        // Invoke
        service.executeFollowUpCompletedPostActions(requestId);

        // Verify
        verify(requestActionUserInfoResolver, times(1))
                .getUsersInfo(followUpReviewDecisionNotification.getOperators(), followUpReviewDecisionNotification.getSignatory(), request);
        verify(noticeService, times(1)).sendFollowUpOfficialNotice(request);

        final ArgumentCaptor<EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload> requestActionPayloadCaptor =
                ArgumentCaptor.forClass(EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload.class);
        verify(requestService, times(1)).addActionToRequest(Mockito.eq(request), requestActionPayloadCaptor.capture(),
                Mockito.eq(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_COMPLETED),
                Mockito.eq(requestPayload.getRegulatorReviewer()));

        final EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload actionPayloadCaptured =
                requestActionPayloadCaptor.getValue();
        assertThat(actionPayloadCaptured.getPayloadType()).isEqualTo(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD);
        assertThat(actionPayloadCaptured.getRequest()).isEqualTo("follow up request");
        assertThat(actionPayloadCaptured.getResponse()).isEqualTo("follow up response");
        assertThat(actionPayloadCaptured.getResponseFiles()).isEqualTo(Set.of(file));
        assertThat(actionPayloadCaptured.getUsersInfo()).isEqualTo(Map.of(
                "operator1", RequestActionUserInfo.builder().name("operator1").roleCode("operator").build(),
                "regulator1", RequestActionUserInfo.builder().name("regulator1").roleCode("regulator").build()
        ));
        assertThat(actionPayloadCaptured.getReviewDecisionNotification()).isEqualTo(requestPayload.getFollowUpReviewDecisionNotification());
        assertThat(actionPayloadCaptured.getReviewDecision()).isEqualTo(expectedReviewDecision);
    }

    @Test
    void isFollowUpNeeded() {
        String requestId = "1";

        final EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload.builder()
                .reviewDecision(EmpNotificationReviewDecision.builder().type(EmpNotificationReviewDecisionType.ACCEPTED).details(
                                EmpNotificationAcceptedDecisionDetails.builder()
                                        .followUp(FollowUp.builder()
                                                .followUpResponseRequired(true)
                                                .build()
                                        )
                                        .build()
                        )
                        .build())
                .build();

        final Request request = Request.builder()
                .id(requestId)
                .payload(requestPayload)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        assertThat(service.isFollowUpNeeded(requestId)).isTrue();

        verify(requestService, times(1)).findRequestById(requestId);
    }

    @ParameterizedTest
    @MethodSource("resolveFollowUpExpirationDateScenarios")
    void resolveFollowUpExpirationDate(EmpNotificationFollowUpReviewDecision reviewDecision,
                                       LocalDate expirationDateFromInitialReview,
                                       LocalDate expectedResponse) {


        String requestId = "1";

        EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload
            .builder()
            .followUpReviewDecision(reviewDecision)
            .reviewDecision(EmpNotificationReviewDecision.builder()
                .details(
                    EmpNotificationAcceptedDecisionDetails
                        .builder()
                        .followUp(
                            FollowUp
                                .builder()
                                .followUpResponseExpirationDate(expirationDateFromInitialReview)
                                .build()
                        )
                        .build()
                ).build())
            .build();

        final Request request = Request.builder()
            .id(requestId)
            .payload(requestPayload)
            .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        Date actualResponse = service.resolveFollowUpExpirationDate(requestId);

        LocalDate actualResponseAsLocalDate = actualResponse.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        assertEquals(expectedResponse, actualResponseAsLocalDate);
        verify(requestService).findRequestById(requestId);
        verifyNoMoreInteractions(requestService);
        verifyNoInteractions(requestActionUserInfoResolver, noticeService);
    }

    private static Stream<Arguments> resolveFollowUpExpirationDateScenarios() {
        LocalDate expirationDateFromInitialReview = LocalDate.now();
        LocalDate expirationDateFromFollowUpResponseReview = LocalDate.now().plusDays(1);

        final EmpNotificationFollowUpReviewDecision accepted = EmpNotificationFollowUpReviewDecision.builder()
            .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().build())
            .build();

        final EmpNotificationFollowUpReviewDecision amendsNeeded = EmpNotificationFollowUpReviewDecision.builder()
            .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
            .details(EmpNotificationFollowupRequiredChangesDecisionDetails
                .builder()
                .dueDate(expirationDateFromFollowUpResponseReview)
                .build())
            .build();

        return Stream.of(
            Arguments.of(accepted, expirationDateFromInitialReview, expirationDateFromInitialReview),
            Arguments.of(amendsNeeded, expirationDateFromInitialReview, expirationDateFromFollowUpResponseReview),
            Arguments.of(null, expirationDateFromInitialReview, expirationDateFromInitialReview));
    }
}
