package uk.gov.mrtm.api.workflow.request.flow.vir.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondedToRegulatorCommentsRequestActionPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class VirApplicationRespondedCustomMapperTest {

    @InjectMocks
    private VirApplicationRespondedCustomMapper mapper;

    @Test
    void toRequestActionDTO() {

        String accountId = "1";
        final LocalDateTime localDateTime = LocalDateTime.now();

        final RequestAction requestAction = RequestAction.builder()
            .id(11L)
            .type(MrtmRequestActionType.VIR_APPLICATION_RESPONDED_TO_REGULATOR_COMMENTS)
            .submitter("operator")
            .creationDate(localDateTime)
            .payload(VirApplicationRespondedToRegulatorCommentsRequestActionPayload.builder()
                .regulatorImprovementResponse(RegulatorImprovementResponse.builder().improvementRequired(true)
                    .improvementComments("Comments 1").build()).build()
            )
            .request(Request.builder()
                    .id("VIR")
                    .requestResources(List.of(RequestResource.builder().resourceId(accountId).resourceType(ResourceType.ACCOUNT).build()))
                    .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                    .build())
            .build();

        final RequestActionDTO expected = RequestActionDTO.builder()
            .id(11L)
            .type(MrtmRequestActionType.VIR_APPLICATION_RESPONDED_TO_REGULATOR_COMMENTS)
            .submitter("operator")
            .creationDate(localDateTime)
            .requestId("VIR")
            .requestAccountId(1L)
            .requestType(MrtmRequestType.VIR)
            .payload(VirApplicationRespondedToRegulatorCommentsRequestActionPayload.builder()
                .regulatorImprovementResponse(RegulatorImprovementResponse.builder().improvementRequired(true)
                    .build()).build()
            )
            .build();

        // Invoke
        final RequestActionDTO actual = mapper.toRequestActionDTO(requestAction);

        // Verify
        assertThat(actual).isEqualTo(expected);
        assertThat(
            ((VirApplicationRespondedToRegulatorCommentsRequestActionPayload) requestAction.getPayload())
                .getRegulatorImprovementResponse().getImprovementComments()).isNotNull();
    }

    @Test
    void getRequestActionType() {
        assertThat(mapper.getRequestActionType()).isEqualTo(
            MrtmRequestActionType.VIR_APPLICATION_RESPONDED_TO_REGULATOR_COMMENTS);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
