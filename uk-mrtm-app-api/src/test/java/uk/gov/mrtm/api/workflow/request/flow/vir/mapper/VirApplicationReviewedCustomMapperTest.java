package uk.gov.mrtm.api.workflow.request.flow.vir.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewedRequestActionPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class VirApplicationReviewedCustomMapperTest {

    @InjectMocks
    private VirApplicationReviewedCustomMapper mapper;

    @Test
    void toRequestActionDTO() {
        
        LocalDateTime localDateTime = LocalDateTime.now();
        FileInfoDTO officialNotice = FileInfoDTO.builder()
                .name("Maritime_Verifier_Improvement_Report_Response_v1.pdf")
                .uuid(UUID.randomUUID().toString())
                .build();

        RequestAction requestAction = RequestAction.builder()
                .id(11L)
                .type(MrtmRequestActionType.VIR_APPLICATION_REVIEWED)
                .submitter("operator")
                .creationDate(localDateTime)
                .payload(VirApplicationReviewedRequestActionPayload.builder()
                        .regulatorReviewResponse(RegulatorReviewResponse.builder()
                                .regulatorImprovementResponses(Map.of(
                                        "A1", RegulatorImprovementResponse.builder().improvementRequired(true).improvementComments("Comments 1").build(),
                                        "A2", RegulatorImprovementResponse.builder().improvementRequired(true).improvementComments("Comments 2").build()
                                ))
                                .reportSummary("reportSummary")
                                .build())
                        .officialNotice(officialNotice)
                        .build())
                .request(Request.builder()
                        .id("AEM")
                        .requestResources(List.of(RequestResource.builder()
                                .resourceType(ResourceType.ACCOUNT)
                                .resourceId("1")
                                .build()))
                        .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                        .build())
                .build();

        RequestActionDTO expected = RequestActionDTO.builder()
                .id(11L)
                .type(MrtmRequestActionType.VIR_APPLICATION_REVIEWED)
                .submitter("operator")
                .creationDate(localDateTime)
                .requestId("AEM")
                .requestAccountId(1L)
                .requestType(MrtmRequestType.VIR)
                .payload(VirApplicationReviewedRequestActionPayload.builder()
                        .regulatorReviewResponse(RegulatorReviewResponse.builder()
                                .regulatorImprovementResponses(Map.of(
                                        "A1", RegulatorImprovementResponse.builder().improvementRequired(true).build(),
                                        "A2", RegulatorImprovementResponse.builder().improvementRequired(true).build()
                                ))
                                .reportSummary("reportSummary")
                                .build())
                        .officialNotice(officialNotice)
                        .build())
                .build();

        // Invoke
        RequestActionDTO actual = mapper.toRequestActionDTO(requestAction);

        // Verify
        assertThat(actual).isEqualTo(expected);
        assertThat(((VirApplicationReviewedRequestActionPayload)requestAction.getPayload())
            .getRegulatorReviewResponse().getRegulatorImprovementResponses().get("A1").getImprovementComments()).isNotNull();
    }

    @Test
    void getRequestActionType() {
        assertThat(mapper.getRequestActionType()).isEqualTo(MrtmRequestActionType.VIR_APPLICATION_REVIEWED);
    }

    @Test
    void getUserRoleTypes() {
        assertThat(mapper.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
