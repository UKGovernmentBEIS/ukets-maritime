package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.DateOfNonSignificantChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotification;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationDetailsOfChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;


@ExtendWith(MockitoExtension.class)
class RequestEmpNotificationReviewServiceTest {

    @InjectMocks
    private RequestEmpNotificationReviewService service;

    @Test
    void saveReviewDecision() {
        EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload actionPayload = EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload.builder()
            .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_SAVE_REVIEW_GROUP_DECISION_PAYLOAD)
            .sectionsCompleted(Map.of("a", "b"))
            .reviewDecision(EmpNotificationReviewDecision.builder()
                .type(EmpNotificationReviewDecisionType.REJECTED)
                .details(
                    EmpNotificationAcceptedDecisionDetails.builder()
                        .notes("notes")
                        .officialNotice("official notice reject")
                        .followUp(FollowUp.builder()
                            .followUpResponseRequired(false)
                            .build()
                        )
                        .build()
                )
                .build())
            .build();

        EmpNotificationApplicationReviewRequestTaskPayload taskPayload = EmpNotificationApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_REVIEW_PAYLOAD)
            .emissionsMonitoringPlanNotification(
                EmissionsMonitoringPlanNotification.builder().detailsOfChange(EmpNotificationDetailsOfChange.builder()
                    .description("description")
                    .justification("justification")
                    .documents(Set.of(UUID.randomUUID()))
                    .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                        .startDate(LocalDate.now())
                        .endDate(LocalDate.now().plusDays(1))
                        .build())
                    .build()).build())
            .reviewDecision(EmpNotificationReviewDecision.builder()
                .type(EmpNotificationReviewDecisionType.ACCEPTED)
                .details(
                    EmpNotificationAcceptedDecisionDetails.builder()
                        .notes("notes")
                        .officialNotice("official notice")
                        .followUp(FollowUp.builder()
                            .followUpResponseRequired(false)
                            .build()
                        )
                        .build()
                )
                .build())
            .build();

        RequestTask requestTask = RequestTask.builder().id(1L)
            .payload(taskPayload)
            .type(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_REVIEW).build())
            .build();

        // Invoke
        service.saveReviewDecision(actionPayload, requestTask);

        // Verify
        assertThat(((EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload()).getReviewDecision())
            .isEqualTo(actionPayload.getReviewDecision());
        assertThat(((EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload()).getSectionsCompleted())
            .isEqualTo(actionPayload.getSectionsCompleted());
    }

    @Test
    void saveRequestPeerReviewAction() {
        String selectedPeerReview = "selectedPeerReview";
        AppUser appUser = AppUser.builder().userId("regulator").build();
        EmpNotificationApplicationReviewRequestTaskPayload taskPayload = EmpNotificationApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_REVIEW_PAYLOAD)
            .sectionsCompleted(Map.of("a", "b"))
            .reviewDecision(EmpNotificationReviewDecision.builder()
                .type(EmpNotificationReviewDecisionType.ACCEPTED)
                .details(
                    EmpNotificationAcceptedDecisionDetails.builder()
                        .notes("notes")
                        .officialNotice("official notice")
                        .followUp(FollowUp.builder()
                            .followUpResponseRequired(false)
                            .build()
                        )
                        .build()
                )
                .build())
            .build();

        RequestTask requestTask = RequestTask.builder().id(1L)
            .request(Request.builder()
                .payload(EmpNotificationRequestPayload.builder()
                    .payloadType(MrtmRequestPayloadType.EMP_NOTIFICATION_REQUEST_PAYLOAD)
                    .build())
                .build())
            .payload(taskPayload)
            .type(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_REVIEW).build())
            .build();

        // Invoke
        service.saveRequestPeerReviewAction(requestTask, selectedPeerReview, appUser);

        // Verify
        assertThat(((EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload()).getReviewDecision())
            .isEqualTo(taskPayload.getReviewDecision());
        assertThat(requestTask.getRequest().getPayload().getRegulatorReviewer())
            .isEqualTo(appUser.getUserId());
        assertThat(requestTask.getRequest().getPayload().getRegulatorPeerReviewer())
            .isEqualTo(selectedPeerReview);
        assertThat(((EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload())
            .getSectionsCompleted()).isEqualTo(taskPayload.getSectionsCompleted());
    }
}
