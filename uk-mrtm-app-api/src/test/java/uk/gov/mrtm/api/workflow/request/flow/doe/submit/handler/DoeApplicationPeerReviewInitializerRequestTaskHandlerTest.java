package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class DoeApplicationPeerReviewInitializerRequestTaskHandlerTest {

    @InjectMocks
    private DoeApplicationPeerReviewInitializerRequestTaskHandler cut;

    @Test
    void initializePayload() {
        Doe doe = Doe.builder()
                .maritimeEmissions(DoeMaritimeEmissions.builder()
                    .determinationReason(
                        DoeDeterminationReason.builder()
                            .details(DoeDeterminationReasonDetails.builder()
                            .type(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT)
                            .noticeText("noticeText")
                            .build())
                            .furtherDetails("furtherDetails")
                            .build()
                    )
                    .build())
                .build();
        DoeRequestPayload requestPayload = DoeRequestPayload.builder()
            .doe(doe)
            .build();
        Request request = Request.builder().payload(requestPayload).build();

        RequestTaskPayload result = cut.initializePayload(request);

        assertThat(result.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.DOE_APPLICATION_PEER_REVIEW_PAYLOAD);
        assertThat(result).isInstanceOf(DoeApplicationSubmitRequestTaskPayload.class);
        assertThat(result).isEqualTo(DoeApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_PEER_REVIEW_PAYLOAD).doe(doe).build());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(cut.getRequestTaskTypes()).containsExactlyInAnyOrder(
            MrtmRequestTaskType.DOE_APPLICATION_PEER_REVIEW);
    }
}
