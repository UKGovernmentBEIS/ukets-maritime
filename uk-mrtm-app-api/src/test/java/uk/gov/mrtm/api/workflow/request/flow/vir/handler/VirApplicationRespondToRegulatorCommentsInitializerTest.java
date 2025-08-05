package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondToRegulatorCommentsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class VirApplicationRespondToRegulatorCommentsInitializerTest {

    @InjectMocks
    private VirApplicationRespondToRegulatorCommentsInitializer initializer;

    @Test
    void initializePayload() {
        
        final VirVerificationData virVerificationData = VirVerificationData.builder()
                .uncorrectedNonConformities(Map.of(
                        "A1",
                        UncorrectedItem.builder()
                                .explanation("Explanation")
                                .reference("A1")
                                .materialEffect(true)
                                .build()))
                .build();
        final Map<String, OperatorImprovementResponse> operatorImprovementResponses = Map.of(
                "A1",
                OperatorImprovementResponse.builder()
                        .isAddressed(false)
                        .addressedDescription("Description")
                        .uploadEvidence(false)
                        .build()
        );
        final RegulatorReviewResponse regulatorReviewResponse = RegulatorReviewResponse.builder()
                .regulatorImprovementResponses(Map.of(
                        "A1", RegulatorImprovementResponse.builder()
                                .improvementRequired(true)
                                .improvementDeadline(LocalDate.now())
                                .build(),
                        "A2", RegulatorImprovementResponse.builder().improvementRequired(false).build()
                ))
                .build();
        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .payload(VirRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.VIR_REQUEST_PAYLOAD)
                        .verificationData(virVerificationData)
                        .operatorImprovementResponses(operatorImprovementResponses)
                        .regulatorReviewResponse(regulatorReviewResponse)
                        .build())
                .build();

        final VirApplicationRespondToRegulatorCommentsRequestTaskPayload expected =
            VirApplicationRespondToRegulatorCommentsRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.VIR_RESPOND_TO_REGULATOR_COMMENTS_PAYLOAD)
                .verificationData(virVerificationData)
                .operatorImprovementResponses(operatorImprovementResponses)
                .regulatorImprovementResponses(Map.of(
                        "A1", RegulatorImprovementResponse.builder()
                                .improvementRequired(true)
                                .improvementDeadline(LocalDate.now())
                                .build()
                ))
                .build();

        // Invoke
        RequestTaskPayload actual = initializer.initializePayload(request);

        // Verify
        assertThat(actual).isInstanceOf(VirApplicationRespondToRegulatorCommentsRequestTaskPayload.class).isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
                .containsExactly(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS);
    }
}
