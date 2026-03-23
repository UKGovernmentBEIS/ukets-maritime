package uk.gov.mrtm.api.workflow.request.flow.aer.verify.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerSaveApplicationVerificationRequestTaskActionPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class RequestAerApplyVerificationServiceTest {

    @InjectMocks
    private RequestAerApplyVerificationService service;

    @Test
    void applySaveAction() {

        final Long accountId = 100L;
        final String requestId = "requestId";
        final Long verificationBodyId = 101L;


        final AerVerificationData verificationData = AerVerificationData.builder()

                .build();

        final Map<String, String> sectionsCompleted = Map.of("subtask", "completed");

        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD).build();

        final Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build(),
                        RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(verificationBodyId.toString()).build()))
                .payload(aerRequestPayload)
                .build();

        final AerSaveApplicationVerificationRequestTaskActionPayload taskActionPayload =
                AerSaveApplicationVerificationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.AER_SAVE_APPLICATION_VERIFICATION_PAYLOAD)
                        .verificationData(verificationData)
                        .verificationSectionsCompleted(sectionsCompleted)
                        .build();

        final AerApplicationVerificationSubmitRequestTaskPayload taskPayload = AerApplicationVerificationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_VERIFICATION_SUBMIT_PAYLOAD)
                .verificationReport(AerVerificationReport.builder().build())
                .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .request(request)
                .build();

        service.applySaveAction(taskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isInstanceOf(AerApplicationVerificationSubmitRequestTaskPayload.class);
        AerApplicationVerificationSubmitRequestTaskPayload resultPayload =
                (AerApplicationVerificationSubmitRequestTaskPayload) requestTask.getPayload();
        assertThat(resultPayload.getVerificationReport().getVerificationData()).isEqualTo(verificationData);
        assertThat(resultPayload.getVerificationSectionsCompleted()).isEqualTo(sectionsCompleted);

        assertThat(((AerRequestPayload) request.getPayload()).getVerificationReport())
                .isEqualTo(taskPayload.getVerificationReport());

        assertThat(((AerRequestPayload) request.getPayload()).isVerificationPerformed()).isFalse();

        assertThat(((AerRequestPayload) request.getPayload()).getVerificationReport().getVerificationBodyId())
                .isEqualTo(verificationBodyId);

        assertThat(((AerRequestPayload) request.getPayload()).getVerificationSectionsCompleted())
                .containsExactlyEntriesOf(taskActionPayload.getVerificationSectionsCompleted());
    }
}
