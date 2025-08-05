package uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpNotificationApplicationCompletedCustomMapperTest {

    @InjectMocks
    private EmpNotificationApplicationCompletedCustomMapper mapper;

    @Test
    void toRequestActionDTO() {

        final RequestAction requestAction = RequestAction.builder()
                .request(Request.builder().id("id").build())
                .type(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_COMPLETED)
                .payload(EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD)
                        .reviewDecision(EmpNotificationFollowUpReviewDecision.builder()
                                .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
                                .details(
                                        EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                                                .notes("the notes")
                                                .requiredChanges(Collections.singletonList(new ReviewDecisionRequiredChange("the changes required", Collections.emptySet())))
                                                .build()
                                )
                                .build())
                        .build())
                .build();

        final RequestActionDTO result = mapper.toRequestActionDTO(requestAction);

        assertThat(result.getType()).isEqualTo(requestAction.getType());
        final EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload resultPayload =
                (EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getReviewDecision().getDetails().getNotes()).isNull();
        assertThat(((EmpNotificationFollowupRequiredChangesDecisionDetails) resultPayload.getReviewDecision().getDetails()).getRequiredChanges().get(0)
                .getReason()).isEqualTo("the changes required");
    }

    @Test
    void getRequestActionType() {
        assertThat(mapper.getRequestActionType()).isEqualTo(MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_COMPLETED);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
