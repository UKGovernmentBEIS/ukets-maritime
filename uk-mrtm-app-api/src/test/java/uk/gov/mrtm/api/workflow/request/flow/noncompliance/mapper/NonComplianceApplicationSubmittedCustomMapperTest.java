package uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmittedRequestActionPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class NonComplianceApplicationSubmittedCustomMapperTest {

    @InjectMocks
    private NonComplianceApplicationSubmittedCustomMapper mapper;

    @Test
    void toRequestActionDTO() {

        final RequestAction requestAction = RequestAction.builder()
            .request(Request.builder().id("id").build())
            .type(MrtmRequestActionType.NON_COMPLIANCE_APPLICATION_SUBMITTED)
            .payload(NonComplianceApplicationSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.NON_COMPLIANCE_APPLICATION_SUBMITTED_PAYLOAD)
                .comments("comments")
                .build())
            .build();

        final RequestActionDTO result = mapper.toRequestActionDTO(requestAction);

        assertThat(result.getType()).isEqualTo(requestAction.getType());
        NonComplianceApplicationSubmittedRequestActionPayload resultPayload =
            (NonComplianceApplicationSubmittedRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getComments()).isNull();
    }

    @Test
    void getRequestActionType() {
        assertThat(mapper.getRequestActionType()).isEqualTo(MrtmRequestActionType.NON_COMPLIANCE_APPLICATION_SUBMITTED);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
