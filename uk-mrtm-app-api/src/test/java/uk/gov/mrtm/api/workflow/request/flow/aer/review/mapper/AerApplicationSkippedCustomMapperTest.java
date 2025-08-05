package uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class AerApplicationSkippedCustomMapperTest {

    @InjectMocks
    private AerApplicationSkippedCustomMapper mapper;

    @Test
    void toRequestActionDTO() {
        AerDataReviewDecision aerDataReviewDecision = AerDataReviewDecision.builder()
                .reviewDataType(AerReviewDataType.AER_DATA)
                .type(AerDataReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build();

        AerApplicationCompletedRequestActionPayload requestActionPayload =
                AerApplicationCompletedRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.AER_APPLICATION_COMPLETED_PAYLOAD)
                        .reviewGroupDecisions(Map.of(AerReviewGroup.OPERATOR_DETAILS, aerDataReviewDecision))
                        .build();

        RequestAction requestAction = RequestAction.builder()
                .request(Request.builder().id("id").build())
                .type(MrtmRequestActionType.AER_APPLICATION_REVIEW_SKIPPED)
                .payload(requestActionPayload)
                .build();

        RequestActionDTO result = mapper.toRequestActionDTO(requestAction);

        AerApplicationCompletedRequestActionPayload resultPayload =
                (AerApplicationCompletedRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getReviewGroupDecisions()).isEmpty();
    }

    @Test
    void getRequestActionType() {
        assertEquals(MrtmRequestActionType.AER_APPLICATION_REVIEW_SKIPPED, mapper.getRequestActionType());
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
    
}
