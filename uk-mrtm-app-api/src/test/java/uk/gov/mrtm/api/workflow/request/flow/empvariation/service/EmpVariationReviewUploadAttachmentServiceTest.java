package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.entry;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationReviewUploadAttachmentServiceTest {

    @InjectMocks
    private EmpVariationReviewUploadAttachmentService service;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void uploadReviewGroupDecisionAttachment() {
        Long requestTaskId = 1L;
        UUID attachmentUuid = UUID.randomUUID();
        String filename = "name";

        EmpVariationApplicationReviewRequestTaskPayload taskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_REVIEW_PAYLOAD)
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan
                                .builder()
                                .abbreviations(EmpAbbreviations
                                        .builder()
                                        .exist(false)
                                        .build())
                                .build())
                        .build();

        RequestTask requestTask = RequestTask.builder().id(requestTaskId).payload(taskPayload).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        assertThat(taskPayload.getReviewAttachments()).isEmpty();

        service.uploadReviewGroupDecisionAttachment(requestTaskId, attachmentUuid.toString(), filename);

        assertThat(taskPayload.getReviewAttachments()).containsExactly(entry(attachmentUuid, filename));
    }
}
