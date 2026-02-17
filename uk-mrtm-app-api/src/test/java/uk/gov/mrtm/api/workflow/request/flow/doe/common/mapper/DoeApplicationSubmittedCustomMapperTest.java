package uk.gov.mrtm.api.workflow.request.flow.doe.common.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeFeeDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class DoeApplicationSubmittedCustomMapperTest {

    @InjectMocks
    private DoeApplicationSubmittedCustomMapper cut;

    @Test
    void toRequestActionDTO() {
        RequestAction requestAction = RequestAction.builder()
                .request(Request.builder().id("id").build())
                .type(MrtmRequestActionType.DOE_APPLICATION_SUBMITTED)
                .payload(DoeApplicationSubmittedRequestActionPayload.builder()
                .doe(Doe.builder().maritimeEmissions(DoeMaritimeEmissions.builder()
                                .determinationReason(
                                    DoeDeterminationReason.builder()
                                        .details(DoeDeterminationReasonDetails.builder()
                                            .type(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT)
                                            .noticeText("noticeText")
                                            .build())
                                        .furtherDetails("furtherDetails")
                                        .build())
                                .feeDetails(DoeFeeDetails.builder()
                                        .comments("comments")
                                        .hourlyRate(BigDecimal.valueOf(1000))
                                        .build())
                                .chargeOperator(true)
                                .build())
                        .build())
                .officialNotice(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("filename").build())
                .build())
            .build();

        RequestActionDTO result = cut.toRequestActionDTO(requestAction);

        assertThat(result).isNotNull();
        assertThat(result.getType()).isEqualTo(requestAction.getType());
        assertThat(result.getPayload()).isInstanceOf(DoeApplicationSubmittedRequestActionPayload.class);

        DoeApplicationSubmittedRequestActionPayload resultPayload =
            (DoeApplicationSubmittedRequestActionPayload) result.getPayload();
        assertThat(resultPayload.getDoe().getMaritimeEmissions().getDeterminationReason().getFurtherDetails()).isNull();
        assertThat(resultPayload.getDoe().getMaritimeEmissions().getDeterminationReason().getDetails().getType())
            .isEqualTo(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT);
        assertThat(resultPayload.getDoe().getMaritimeEmissions().getDeterminationReason().getDetails().getNoticeText())
            .isEqualTo("noticeText");
        assertThat(resultPayload.getDoe().getMaritimeEmissions().getFeeDetails().getComments()).isNull();
    }

    @Test
    void getUserRoleTypes() {
        assertThat(cut.getUserRoleTypes()).containsExactlyInAnyOrder(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}