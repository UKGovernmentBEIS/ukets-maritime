package uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpReturnedForAmendsCustomMapperTest {

    @InjectMocks
    private EmpNotificationFollowUpReturnedForAmendsCustomMapper mapper;

    @Test
    void toRequestActionDTO() {

        final String changesRequired = "the changes required";

        final RequestAction requestAction = RequestAction.builder()
                .request(Request.builder()
                        .id("requestId")
                        .build())
                .type(MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS)
                .payload(EmpNotificationFollowUpReturnedForAmendsRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS_PAYLOAD)
                        .decisionDetails(EmpNotificationFollowupRequiredChangesDecisionDetails.builder().notes("the notes").requiredChanges(
                                Collections.singletonList(new ReviewDecisionRequiredChange(changesRequired, Collections.emptySet()))).build())
                        .build())
                .build();

        final RequestActionDTO result = mapper.toRequestActionDTO(requestAction);

        assertThat(result.getType()).isEqualTo(requestAction.getType());
        final EmpNotificationFollowUpReturnedForAmendsRequestActionPayload resultPayload =
                (EmpNotificationFollowUpReturnedForAmendsRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getDecisionDetails().getNotes()).isNull();
        assertThat(resultPayload.getDecisionDetails().getRequiredChanges().get(0).getReason()).isEqualTo(changesRequired);
    }

    @Test
    void getRequestActionType() {
        assertThat(mapper.getRequestActionType()).isEqualTo(
                MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
